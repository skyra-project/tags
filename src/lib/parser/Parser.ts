import { ParserMissingTokenError } from '../errors/ParserMissingTokenError';
import { ParserOptionMissingContentError } from '../errors/ParserOptionMissingContentError';
import { ParserPickMissingOptionsError } from '../errors/ParserPickMissingOptionsError';
import { ParserUnexpectedTokenError } from '../errors/ParserUnexpectedTokenError';
import { Pick, PickMapKey } from '../structures/Pick';
import { Sentence, SentencePart, SentencePartType } from '../structures/Sentence';
import { Tag } from '../structures/Tag';
import { Transformer } from '../structures/Transformer';
import { Lexer, PartIterator, PartType, ReadonlyPart } from './Lexer';

export class Parser {
	public readonly kParts: PartIterator;
	private readonly kBacktrackBuffer: ReadonlyPart[] = [];

	public constructor(parts: Lexer | PartIterator) {
		this.kParts = parts instanceof Lexer ? parts[Symbol.iterator]() : parts;
	}

	public parse() {
		let buffer = '';
		const parts: SentencePart[] = [];
		for (const part of this.kParts) {
			if (part.type === PartType.TagStart) {
				if (buffer.length > 0) {
					parts.push({ type: SentencePartType.Literal, value: buffer });
					buffer = '';
				}

				parts.push({ type: SentencePartType.Tag, value: this.parseTag() });
			} else {
				buffer += this.tokenToString(part);
			}
		}

		if (buffer.length > 0) {
			parts.push({ type: SentencePartType.Literal, value: buffer });
			buffer = '';
		}

		return new Sentence(parts);
	}

	private next() {
		if (this.kBacktrackBuffer.length) return this.kBacktrackBuffer.pop()!;

		const result = this.kParts.next();
		if (result.done) throw new ParserMissingTokenError();

		return result.value;
	}

	private nextExcluding(excluded: PartType) {
		let part: ReadonlyPart | undefined = undefined;
		while ((part = this.next()).type === excluded) continue;

		return part;
	}

	private pick<T extends PartType>(type: T): ReadonlyPart & { type: T } {
		const part = this.next();
		this.validate(part, type);

		return part as ReadonlyPart & { type: T };
	}

	private validate<T extends PartType>(part: ReadonlyPart, type: T): asserts part is ReadonlyPart & { type: T } {
		if (part.type !== type) throw new ParserUnexpectedTokenError(type, part.type);
	}

	/**
	 * Called When: part.type is `PartType.TagStart`.
	 * Expected: `[...Space] <Literal> <TagStart> <Literal> <TagEnd>`.
	 */
	private parseTag() {
		let name = '';
		let type = this.pick(PartType.Literal).value;
		let pick: Pick | null = null;
		let finished = false;
		const transformers: Transformer[] = [];

		// {pick =option0{value0} =option1{value1} [| transformer0[| transformer1]]}
		if (type === 'pick') {
			pick = this.parsePick();
		} else {
			const part = this.nextExcluding(PartType.Space);
			if (part.type === PartType.Colon) {
				// {name:type [| transformer0[| transformer1]]}
				name = type;
				type = this.parseTagType();
			} else if (part.type === PartType.Pipe) {
				// {type [| transformer0[| transformer1]]}
				transformers.push(this.parsePipeTokens());
			} else if (part.type === PartType.TagEnd) {
				// {type}
				finished = true;
			} else {
				throw new ParserUnexpectedTokenError([PartType.Colon, PartType.Pipe, PartType.TagEnd], part.type);
			}
		}

		while (!finished) {
			const part = this.nextExcluding(PartType.Space);

			// 1. If encountered a tag end, cut:
			if (part.type === PartType.TagEnd) {
				finished = true;
				break;
			}

			// 1. If encountered a pipe, parse transformer:
			this.validate(part, PartType.Pipe);
			transformers.push(this.parsePipeTokens());
		}

		return new Tag(name, type, pick, transformers);
	}

	private parsePick(): Pick {
		const map = new Map<PickMapKey, string>();

		while (true) {
			const part = this.nextExcluding(PartType.Space);

			// 1. If a tag end or a pipe has been encountered, add the part to the backtrack buffer and break:
			if (part.type === PartType.TagEnd || part.type === PartType.Pipe) {
				this.kBacktrackBuffer.push(part);
				break;
			}

			// 2. Validate first part: <Equals>:
			this.validate(part, PartType.Equals);

			// 3. Retrieve the option's data:
			const [key, value] = this.parseOptionTokens();
			map.set(key, value);
		}

		// 4. Throw if the pick has no options:
		if (map.size === 0) {
			throw new ParserPickMissingOptionsError();
		}

		return new Pick(map);
	}

	/**
	 * Called When: part.type is `PartType.Colon`.
	 * Expected: `[...Space] <Literal>`.
	 */
	private parseTagType(): string {
		const part = this.nextExcluding(PartType.Space);

		// 1. Validate first part: <Literal> |> `=[ ]option`:
		this.validate(part, PartType.Literal);

		// 2. Return the literal value:
		return part.value;
	}

	/**
	 * Called When: part.type is `PartType.Equals`.
	 * Expected: `[...Space] <Literal> <TagStart> <Literal> <TagEnd>`.
	 */
	private parseOptionTokens(): readonly [PickMapKey, string] {
		const part = this.nextExcluding(PartType.Space);

		let name: PickMapKey = Pick.kFallback;

		// 1. Overloaded, two options:
		// -> 1.1. `=[ ]option{`.
		// -> 1.2. `=[ ]{`.

		// 1.1.1. Validate second part: <Literal> |> `=[ ]option`:
		if (part.type === PartType.Literal) {
			name = part.value.trim();

			// 1.1.1. Validate continuation of second part: <TagStart> |> `=[ ]option{`:
			this.pick(PartType.TagStart);
		} else {
			// 1.2.1 Validate alternative of second part: <TagStart> |> `=[ ]{`:
			this.validate(part, PartType.TagStart);
		}

		let buffer = '';
		let content: ReadonlyPart | undefined = undefined;
		while (true) {
			// 2. Validate third part: <Literal> |> `=[ ]option{content`:
			content = this.next();

			// 3. Overloaded, two options:
			// -> 3.1. <TagEnd> |> `<token...>}`.
			// -> 3.2. <Any> |> `<token...><token>`.

			// 3.1. If the loop encountered a tag end, stop:
			if (content.type === PartType.TagEnd) {
				break;
			}

			// 3.2. Otherwise convert the token to a string and append it to the buffer:
			buffer += this.tokenToString(content);
		}

		// 4. Check if the buffer has enough characters:
		if (buffer.length === 0) {
			throw new ParserOptionMissingContentError();
		}

		// 5. Validate fourth part: <TagEnd> |> `=[ ]option{content}`:
		// 5.1. Push to Backtrack so TagEnd is available:
		this.kBacktrackBuffer.push(content);

		// 6. Return the key and value as a tuple:
		return [name, buffer] as const;
	}

	/**
	 * Called When: part.type is `PartType.Pipe`.
	 * Expected: `[...Space] <Literal>`.
	 */
	private parsePipeTokens() {
		const part = this.nextExcluding(PartType.Space);

		this.validate(part, PartType.Literal);
		return new Transformer(part.value.trim());
	}

	private tokenToString(part: ReadonlyPart): string {
		switch (part.type) {
			case PartType.Space:
				return ' ';
			case PartType.TagStart:
				return '{';
			case PartType.TagEnd:
				return '}';
			case PartType.Equals:
				return '=';
			case PartType.Colon:
				return ':';
			case PartType.Pipe:
				return '|';
			case PartType.Literal: {
				return part.value;
			}
		}
	}
}

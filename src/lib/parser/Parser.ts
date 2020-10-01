import { ParserMissingTokenError } from '../errors/ParserMissingTokenError';
import { ParserUnexpectedTokenError } from '../errors/ParserUnexpectedTokenError';
import { Pick } from '../structures/Pick';
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
		const part = this.kBacktrackBuffer.length ? this.kBacktrackBuffer.pop() : (this.kParts.next().value as ReadonlyPart | undefined);
		if (typeof part === 'undefined') throw new ParserMissingTokenError();
		return part;
	}

	private pick<T extends PartType>(type: T): ReadonlyPart & { type: T } {
		const part = this.next();
		this.validate(part, type);

		return part as ReadonlyPart & { type: T };
	}

	private validate<T extends PartType>(part: ReadonlyPart, type: T): asserts part is ReadonlyPart & { type: T } {
		if (part.type !== type) throw new ParserUnexpectedTokenError();
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
			const part = this.next();
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
				throw new ParserUnexpectedTokenError();
			}
		}

		while (!finished) {
			const part = this.next();
			// 1. Spaces are ignored:
			if (part.type === PartType.Space) continue;

			// 2. If encountered a tag end, cut:
			if (part.type === PartType.TagEnd) {
				finished = true;
				break;
			}

			// 3. If encountered a pipe, parse transformer:
			this.validate(part, PartType.Pipe);
			transformers.push(this.parsePipeTokens());
		}

		return new Tag(name, type, pick, transformers);
	}

	private parsePick(): Pick {
		const map = new Map<string, string>();

		for (const part of this.kParts) {
			// 1. Spaces are ignored:
			if (part.type === PartType.Space) continue;

			// 2. If a tag end or a pipe has been encountered, add the part to the backtrack buffer and break:
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

		return new Pick(map);
	}

	/**
	 * Called When: part.type is `PartType.Colon`.
	 * Expected: `[...Space] <Literal>`.
	 */
	private parseTagType(): string {
		for (const part of this.kParts) {
			// 1. Spaces are ignored:
			if (part.type === PartType.Space) continue;

			// 2. Validate first part: <Literal> |> `=[ ]option`:
			this.validate(part, PartType.Literal);

			// 3. Return the literal value:
			return part.value;
		}

		throw new ParserMissingTokenError();
	}

	/**
	 * Called When: part.type is `PartType.Equals`.
	 * Expected: `[...Space] <Literal> <TagStart> <Literal> <TagEnd>`.
	 */
	private parseOptionTokens(): readonly [string, string] {
		for (const part of this.kParts) {
			// 1. Spaces are ignored:
			if (part.type === PartType.Space) continue;

			// 2. Validate first part: <Literal> |> `=[ ]option`:
			this.validate(part, PartType.Literal);

			// 3. Validate second part: <TagStart> |> `=[ ]option{`:
			this.pick(PartType.TagStart);

			// 4. Validate third part: <Literal> |> `=[ ]option{content`:
			const content = this.pick(PartType.Literal);

			// 5. Validate fourth part: <TagEnd> |> `=[ ]option{content}`:
			this.pick(PartType.TagEnd);

			// 6. Return the key and value as a tuple:
			return [part.value.trim(), content.value] as const;
		}

		throw new ParserMissingTokenError();
	}

	/**
	 * Called When: part.type is `PartType.Pipe`.
	 * Expected: `[...Space] <Literal>`.
	 */
	private parsePipeTokens() {
		for (const part of this.kParts) {
			if (part.type === PartType.Space) continue;
			if (part.type === PartType.Literal) return new Transformer(part.value.trim());
			throw new ParserUnexpectedTokenError();
		}

		throw new ParserMissingTokenError();
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

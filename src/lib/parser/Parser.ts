import { MismatchingNamedArgumentTypeValidationError } from '../errors/MismatchingNamedArgumentTypeValidationError';
import { ParserEmptyStringTagError } from '../errors/ParserEmptyStringTagError';
import { ParserMissingTokenError } from '../errors/ParserMissingTokenError';
import { ParserPickMissingOptionsError } from '../errors/ParserPickMissingOptionsError';
import { ParserRandomDuplicatedOptionsError } from '../errors/ParserRandomDuplicatedOptionsError';
import { ParserRandomMissingOptionsError } from '../errors/ParserRandomMissingOptionsError';
import { ParserUnexpectedTokenError } from '../errors/ParserUnexpectedTokenError';
import { Pick, PickMapKey } from '../structures/Pick';
import { Random } from '../structures/Random';
import { SentencePart, SentencePartType } from '../structures/Sentence';
import { Tag } from '../structures/Tag';
import { Transformer } from '../structures/Transformer';
import { Lexer, PartIterator, PartType, ReadonlyPart } from './Lexer';

export class Parser {
	public readonly tags: Tag[] = [];
	public readonly parts: SentencePart[] = [];
	public readonly input: PartIterator;
	private readonly backtrackBuffer: ReadonlyPart[] = [];

	public constructor(parts: Lexer | PartIterator) {
		this.input = parts instanceof Lexer ? parts[Symbol.iterator]() : parts;
	}

	public parse() {
		let buffer = '';
		for (const part of this.input) {
			if (part.type === PartType.TagStart) {
				if (buffer.length > 0) {
					this.parts.push({ type: SentencePartType.Literal, value: buffer });
					buffer = '';
				}

				const tag = this.parseTag();
				this.tags.push(tag);
				this.parts.push({ type: SentencePartType.Tag, value: tag });
			} else {
				buffer += this.tokenToString(part);
			}
		}

		if (buffer.length > 0) {
			this.parts.push({ type: SentencePartType.Literal, value: buffer });
		}

		return this.parts;
	}

	public check() {
		if (this.tags.length === 0) return;

		const entries = new Map<string, Tag>();
		for (const tag of this.tags) {
			if (tag.name === null) continue;

			const entry = entries.get(tag.name);
			if (typeof entry === 'undefined') {
				entries.set(tag.name, tag);
				continue;
			}

			if (entry.type !== tag.type) {
				throw new MismatchingNamedArgumentTypeValidationError(tag, entry);
			}
		}
	}

	private next() {
		if (this.backtrackBuffer.length) return this.backtrackBuffer.pop()!;

		const result = this.input.next();
		if (result.done) throw new ParserMissingTokenError();

		return result.value;
	}

	private nextExcluding(excluded: PartType) {
		let part: ReadonlyPart;
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
		let modifier: Pick | Random | null = null;
		let finished = false;
		const transformers: Transformer[] = [];

		if (type === 'pick') {
			// {pick =option0{value0} =option1{value1} [| transformer0[| transformer1]]}
			modifier = this.parsePick();
		} else if (type === 'random') {
			// {random {key1} {key2} [| transformer0[| transformer1]]}
			modifier = this.parseRandom();
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
				break;
			}

			// 1. If encountered a pipe, parse transformer:
			this.validate(part, PartType.Pipe);
			transformers.push(this.parsePipeTokens());
		}

		return new Tag(name, type, modifier, transformers);
	}

	private parsePick(): Pick {
		const map = new Map<PickMapKey, string>();

		while (true) {
			const part = this.nextExcluding(PartType.Space);

			// 1. If a tag end or a pipe has been encountered, add the part to the backtrack buffer and break:
			if (part.type === PartType.TagEnd || part.type === PartType.Pipe) {
				this.backtrackBuffer.push(part);
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

	private parseRandom(): Random {
		const items: string[] = [];

		while (true) {
			const part = this.nextExcluding(PartType.Space);

			// 1. If a tag end or a pipe has been encountered, add the part to the backtrack buffer and break:
			if (part.type === PartType.TagEnd || part.type === PartType.Pipe) {
				this.backtrackBuffer.push(part);
				break;
			}

			// 2. Validate first part: <TagStart>:
			this.validate(part, PartType.TagStart);

			// 3. Read the string tag:
			// 4. Push the string into the options:
			items.push(this.parseTagString());
		}

		// 5. Throw if the random does not have at least 2 items:
		if (items.length < 2) {
			throw new ParserRandomMissingOptionsError();
		}

		// 6. Throw if there is at least one duplicated item:
		if (new Set(items).size !== items.length) {
			throw new ParserRandomDuplicatedOptionsError();
		}

		return new Random(items);
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

		let name: PickMapKey = Pick.fallback;

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

		// 2. Read the string tag:
		const content = this.parseTagString();

		// 3. Return the key and value as a tuple:
		return [name, content] as const;
	}

	private parseTagString() {
		let buffer = '';
		while (true) {
			// 1. Validate third part: <Literal> |> `=[ ]option{content`:
			const content = this.next();

			// 2. Overloaded, two options:
			// -> 2.1. <TagEnd> |> `<token...>}`.
			// -> 2.2. <Any> |> `<token...><token>`.

			// 2.1. If the loop encountered a tag end, stop:
			if (content.type === PartType.TagEnd) {
				break;
			}

			// 2.2. Otherwise convert the token to a string and append it to the buffer:
			buffer += this.tokenToString(content);
		}

		// 3. Check if the buffer has enough characters:
		if (buffer.length === 0) {
			throw new ParserEmptyStringTagError();
		}

		return buffer;
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

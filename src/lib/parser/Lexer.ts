import { CharacterStream } from './CharacterStream';

export const enum PartType {
	Space,
	TagStart,
	TagEnd,
	Equals,
	Colon,
	Pipe,
	Literal
}

const kCharacterSpace = ' '.charCodeAt(0);
const kCharacterTagStart = '{'.charCodeAt(0);
const kCharacterTagEnd = '}'.charCodeAt(0);
const kCharacterEquals = '='.charCodeAt(0);
const kCharacterColon = ':'.charCodeAt(0);
const kCharacterPipe = '|'.charCodeAt(0);

/**
 * Represents a set of non-token characters.
 */
export interface PartLiteral {
	type: PartType.Literal;
	value: string;
}

/**
 * Represents a space (` `) token.
 */
export interface PartSpace {
	type: PartType.Space;
}

/**
 * Represents a tag start (`{`) token.
 */
export interface PartTagStart {
	type: PartType.TagStart;
}

/**
 * Represents a tag end (`}`) token.
 */
export interface PartTagEnd {
	type: PartType.TagEnd;
}

/**
 * Represents an equals (`=`) token.
 */
export interface PartEquals {
	type: PartType.Equals;
}

/**
 * Represents a colon (`:`) token.
 */
export interface PartColon {
	type: PartType.Colon;
}

/**
 * Represents a pipe (`|`) token.
 */
export interface PartPipe {
	type: PartType.Pipe;
}

export type Part = PartLiteral | PartSpace | PartTagStart | PartTagEnd | PartEquals | PartColon | PartPipe;
export type ReadonlyPart = Readonly<Part>;
export type PartIterator = IterableIterator<ReadonlyPart>;

export class Lexer {
	private buffer = '';
	private parts: Part[] = [];
	private stream: CharacterStream;

	public constructor(str: string) {
		this.stream = new CharacterStream(str);
	}

	public *[Symbol.iterator](): PartIterator {
		while (this.stream.next()) {
			const char = this.stream.peek();
			const code = char.codePointAt(0)!;
			switch (code) {
				case kCharacterTagStart:
					yield* this.pushPart({ type: PartType.TagStart });
					break;
				case kCharacterTagEnd:
					yield* this.pushPart({ type: PartType.TagEnd });
					break;
				case kCharacterEquals:
					yield* this.pushPart({ type: PartType.Equals });
					break;
				case kCharacterColon:
					yield* this.pushPart({ type: PartType.Colon });
					break;
				case kCharacterPipe:
					yield* this.pushPart({ type: PartType.Pipe });
					break;
				default:
					// Space tokens are applied only when the literal buffer is empty:
					if (this.buffer.length === 0 && code === kCharacterSpace) {
						yield* this.pushPart({ type: PartType.Space });
					} else {
						this.buffer += char;
					}
			}
		}

		yield* this.flushPart();
	}

	private *pushPart(part: Part): PartIterator {
		yield* this.flushPart();
		this.parts.push(part);
		yield part;
	}

	private *flushPart(): PartIterator {
		if (this.buffer !== '') {
			const part: Part = { type: PartType.Literal, value: this.buffer };
			this.parts.push(part);
			this.buffer = '';
			yield part;
		}
	}
}

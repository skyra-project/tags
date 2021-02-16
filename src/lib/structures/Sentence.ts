import { SentenceMissingArgumentError } from '../errors/SentenceMissingArgumentError';
import { Lexer } from '../parser/Lexer';
import { Parser } from '../parser/Parser';
import type { Tag } from './Tag';

export const enum SentencePartType {
	Literal,
	Tag
}

export class Sentence {
	public readonly parts: readonly SentencePart[] = [];

	public constructor(parts: readonly SentencePart[]) {
		this.parts = parts;
	}

	public *run(): Iterator<Tag, string, string> {
		let output = '';
		const resolved = new Map<string, string>();
		for (const part of this.parts) {
			if (part.type === SentencePartType.Literal) {
				output += part.value;
			} else {
				const { name } = part.value;
				let value = name ? resolved.get(name) : null;
				if (!value) {
					value = yield part.value;
					if (typeof value === 'undefined') throw new SentenceMissingArgumentError();
					if (name) resolved.set(name, value);
				}
				output += part.value.run(value);
			}
		}

		return output;
	}

	public toString(): string {
		return this.parts.map((part) => (part.type === SentencePartType.Literal ? part.value : part.value.toString())).join('');
	}

	public static from(content: string) {
		return new this(new Parser(new Lexer(content)).parse());
	}
}

export interface SentencePartLiteral {
	type: SentencePartType.Literal;
	value: string;
}

export interface SentencePartTag {
	type: SentencePartType.Tag;
	value: Tag;
}

export type SentencePart = SentencePartLiteral | SentencePartTag;

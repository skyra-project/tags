import { SentenceMissingArgumentError } from '../errors/SentenceMissingArgumentError';
import type { Tag } from './Tag';

export const enum SentencePartType {
	Literal,
	Tag
}

export class Sentence {
	private readonly kParts: readonly SentencePart[] = [];

	public constructor(parts: readonly SentencePart[]) {
		this.kParts = parts;
	}

	public *[Symbol.iterator](): Iterator<Tag, string, string> {
		let output = '';
		const resolved = new Map<string, string>();
		for (const part of this.kParts) {
			if (part.type === SentencePartType.Literal) {
				output += part.value;
			} else {
				const name = part.value.kName;
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

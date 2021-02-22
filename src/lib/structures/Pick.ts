import { PickInvalidOptionError } from '../errors/PickInvalidOptionError';
import type { ISentencePart } from './ISentencePart';

export class Pick implements ISentencePart {
	private readonly options: PickData;

	public constructor(options: PickData) {
		this.options = options;
	}

	public run(key: string): string {
		const value = this.options.get(key);
		if (typeof value === 'string') return value;

		const fallback = this.options.get(Pick.fallback);
		if (typeof fallback === 'string') return fallback;

		throw new PickInvalidOptionError(this, key);
	}

	public toString(): string {
		let output = 'pick';
		for (const [key, value] of this.options) {
			output += ` =${key === Pick.fallback ? '' : key}{${value}}`;
		}

		return output;
	}

	public static readonly fallback: unique symbol = Symbol('Skyra.Tags.Pick.Fallback');
}

export type PickMapKey = string | typeof Pick.fallback;
export type PickMapValue = string;
export type PickData = ReadonlyMap<PickMapKey, PickMapValue>;

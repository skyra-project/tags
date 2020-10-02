import { PickInvalidOptionError } from '../errors/PickInvalidOptionError';
import type { ISentencePart } from './ISentencePart';

export class Pick implements ISentencePart {
	private readonly kOptions: PickData;

	public constructor(options: PickData) {
		this.kOptions = options;
	}

	public run(key: string): string {
		const value = this.kOptions.get(key);
		if (typeof value === 'string') return value;

		const fallback = this.kOptions.get(Pick.kFallback);
		if (typeof fallback === 'string') return fallback;

		throw new PickInvalidOptionError(this, key, `The key ${key} is not a valid option.`);
	}

	public static readonly kFallback: unique symbol = Symbol('Skyra.Tags.Pick.Fallback');
}

export type PickMapKey = string | typeof Pick.kFallback;
export type PickMapValue = string;
export type PickData = ReadonlyMap<PickMapKey, PickMapValue>;

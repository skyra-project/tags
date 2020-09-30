import { PickInvalidOptionError } from '../errors/PickInvalidOptionError';

export class Pick {
	private readonly kOptions: ReadonlyMap<string | typeof Pick.kFallback, string>;

	public constructor(options: ReadonlyMap<string, string>) {
		this.kOptions = options;
	}

	public run(key: string): string {
		const value = this.kOptions.get(key);
		if (typeof value === 'string') return value;

		const fallback = this.kOptions.get(Pick.kFallback);
		if (typeof fallback === 'string') return fallback;

		throw new PickInvalidOptionError();
	}

	public static readonly kFallback: unique symbol = Symbol('Skyra.Tags.Pick.Fallback');
}

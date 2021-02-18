import type { ISentencePart } from './ISentencePart';
import type { Pick } from './Pick';
import type { Random } from './Random';
import type { Transformer } from './Transformer';

export class Tag implements ISentencePart {
	public readonly name: string | null;
	public readonly type: string;
	private readonly modifier: Pick | Random | null;
	private readonly transformers: readonly Transformer[];

	public constructor(name: string, type: string, modifier: Pick | Random | null, transformers: readonly Transformer[]) {
		this.name = name.length === 0 ? null : name;
		this.type = type.length === 0 ? 'string' : type;
		this.modifier = modifier;
		this.transformers = transformers;
	}

	public run(value: string) {
		// If there is a modifier, run through it:
		if (this.modifier !== null) {
			value = this.modifier.run(value);
		}

		// Run all transformers:
		for (const transformer of this.transformers) {
			value = transformer.run(value);
		}

		// Returns the modified value:
		return value;
	}

	public toString(): string {
		const name = this.name ? `${this.name}:` : '';
		const type = this.modifier?.toString() ?? this.type;
		const transformers = this.transformers.length === 0 ? '' : ` | ${this.transformers.join(' | ')}`;
		return `{${name}${type}${transformers}}`;
	}
}

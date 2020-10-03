import type { ISentencePart } from './ISentencePart';
import type { Pick } from './Pick';
import type { Random } from './Random';
import type { Transformer } from './Transformer';

export class Tag implements ISentencePart {
	public readonly kName: string | null;
	public readonly kType: string | null;
	private readonly kModifier: Pick | Random | null;
	private readonly kTransformers: readonly Transformer[];

	public constructor(name: string, type: string, modifier: Pick | Random | null, transformers: readonly Transformer[]) {
		this.kName = name.length === 0 ? null : name;
		this.kType = type.length === 0 ? null : type;
		this.kModifier = modifier;
		this.kTransformers = transformers;
	}

	public run(value: string) {
		// If there is a modifier, run through it:
		if (this.kModifier !== null) {
			value = this.kModifier.run(value);
		}

		// Run all transformers:
		for (const transformer of this.kTransformers) {
			value = transformer.run(value);
		}

		// Returns the modified value:
		return value;
	}
}

import type { ISentencePart } from './ISentencePart';
import type { Pick } from './Pick';
import type { Transformer } from './Transformer';

export class Tag implements ISentencePart {
	public readonly kName: string | null;
	public readonly kType: string | null;
	private readonly kPick: Pick | null;
	private readonly kTransformers: readonly Transformer[];

	public constructor(name: string | null, type: string | null, pick: Pick | null, transformers: readonly Transformer[]) {
		this.kName = name;
		this.kType = type;
		this.kPick = pick;
		this.kTransformers = transformers;
	}

	public run(value: string) {
		// If there is a pick, run through it:
		if (this.kPick !== null) {
			value = this.kPick.run(value);
		}

		// Run all transformers:
		for (const transformer of this.kTransformers) {
			value = transformer.run(value);
		}

		// Returns the modified value:
		return value;
	}
}

import type { ISentencePart } from './ISentencePart';

export class Random implements ISentencePart {
	public readonly options: readonly string[];

	public constructor(options: readonly string[]) {
		this.options = options;
	}

	public run(): string {
		const index = Math.floor(Math.random() * this.options.length);
		return this.options[index];
	}

	public toString(): string {
		return `random ${this.options.map((option) => `{${option}}`).join(' ')}`;
	}
}

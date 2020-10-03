import type { ISentencePart } from './ISentencePart';

export class Random implements ISentencePart {
	public readonly kOptions: readonly string[];

	public constructor(options: readonly string[]) {
		this.kOptions = options;
	}

	public run(): string {
		const index = Math.floor(Math.random() * this.kOptions.length);
		return this.kOptions[index];
	}
}

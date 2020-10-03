import type { Transformer } from '../structures/Transformer';

export class TransformerInvalidFormatterError extends Error {
	public readonly kTransformer: Transformer;
	public readonly kName: string;

	public constructor(transformer: Transformer, name: string) {
		super(`The key ${name} does not correspond with a valid formatter.`);
		this.kTransformer = transformer;
		this.kName = name;
	}
}

import type { Transformer } from '../structures/Transformer';

export class TransformerInvalidFormatterError extends Error {
	public readonly kTransformer: Transformer;
	public readonly kName: string;

	public constructor(transformer: Transformer, name: string, message: string) {
		super(message);
		this.kTransformer = transformer;
		this.kName = name;
	}
}

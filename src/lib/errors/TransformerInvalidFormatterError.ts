import type { Transformer } from '../structures/Transformer';

export class TransformerInvalidFormatterError extends Error {
	public readonly transformer: Transformer;
	public readonly name: string;

	public constructor(transformer: Transformer, name: string) {
		super(`The key ${name} does not correspond with a valid formatter.`);
		this.transformer = transformer;
		this.name = name;
	}
}

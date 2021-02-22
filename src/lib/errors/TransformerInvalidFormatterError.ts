import type { Transformer } from '../structures/Transformer';
import { Identifiers, UserError } from './base/UserError';

export class TransformerInvalidFormatterError extends UserError {
	public readonly transformer: Transformer;
	public readonly formatter: string;

	public constructor(transformer: Transformer, formatter: string) {
		super(Identifiers.TransformerInvalidFormatter, `The key ${formatter} does not correspond with a valid formatter.`);
		this.transformer = transformer;
		this.formatter = formatter;
	}
}

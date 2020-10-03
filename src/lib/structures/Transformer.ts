import { TransformerInvalidFormatterError } from '../errors/TransformerInvalidFormatterError';
import type { ISentencePart } from './ISentencePart';

export class Transformer implements ISentencePart {
	private readonly kRun: IFormatter;

	public constructor(name: string) {
		const formatter = Transformer.kFormatters.get(name);
		if (typeof formatter === 'undefined') {
			throw new TransformerInvalidFormatterError(this, name);
		}

		this.kRun = formatter;
	}

	public run(value: string): string {
		return this.kRun(value);
	}

	public static readonly kFormatters = new Map<string, IFormatter>();
}

export interface IFormatter {
	(value: string): string;
}

import { TransformerInvalidFormatterError } from '../errors/TransformerInvalidFormatterError';
import type { ISentencePart } from './ISentencePart';

export class Transformer implements ISentencePart {
	private readonly kRun: IFormatter;

	public constructor(name: string) {
		this.kRun = Transformer.getFormatter(name);
	}

	public run(value: string): string {
		return this.kRun(value);
	}

	public static readonly kFormatters = new Map<string, IFormatter>();

	private static getFormatter(name: string): IFormatter {
		const formatter = this.kFormatters.get(name);
		if (typeof formatter === 'undefined') throw new TransformerInvalidFormatterError();
		return formatter;
	}
}

export interface IFormatter {
	(value: string): string;
}

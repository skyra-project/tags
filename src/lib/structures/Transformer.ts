import { TransformerInvalidFormatterError } from '../errors/TransformerInvalidFormatterError';
import { Unreachable } from '../errors/Unreachable';
import type { ISentencePart } from './ISentencePart';

export class Transformer implements ISentencePart {
	public readonly name: string;

	public constructor(name: string) {
		const formatter = Transformer.kFormatters.get(name);
		if (typeof formatter === 'undefined') {
			throw new TransformerInvalidFormatterError(this, name);
		}

		this.name = name;
		this.run = formatter;
	}

	public run(value: string): string;
	public run(): string {
		throw new Unreachable();
	}

	public toString(): string {
		return this.name;
	}

	public static readonly kFormatters = new Map<string, IFormatter>();
}

export interface IFormatter {
	(value: string): string;
}

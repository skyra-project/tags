import { Transformer, TransformerInvalidFormatterError } from '../../src';

describe('Transformer', () => {
	Transformer.kFormatters.set('uppercase', (value) => value.toUpperCase());

	test('Invalid Formatter', () => {
		expect(() => new Transformer('invalid')).toThrow(TransformerInvalidFormatterError);
	});

	test('Valid Formatter', () => {
		expect(() => new Transformer('uppercase')).not.toThrow();
	});

	test('Run Formatter', () => {
		expect(new Transformer('uppercase').run('hello world!')).toBe('HELLO WORLD!');
	});
});

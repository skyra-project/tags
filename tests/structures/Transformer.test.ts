import { Transformer, TransformerInvalidFormatterError } from '../../src';

describe('Transformer', () => {
	test('Invalid Formatter', () => {
		expect(() => new Transformer('invalid')).toThrow(TransformerInvalidFormatterError);
	});

	test('Valid Formatter', () => {
		expect(() => new Transformer('uppercase')).not.toThrow();
	});

	test('Run Formatter', () => {
		expect(new Transformer('uppercase').run('hello world!')).toBe('HELLO WORLD!');
	});

	test('toString | Valid Formatter', () => {
		expect(new Transformer('uppercase').toString()).toBe('uppercase');
	});
});

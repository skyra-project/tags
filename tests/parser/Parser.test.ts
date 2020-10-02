import { Lexer, Parser, ParserMissingTokenError, ParserUnexpectedTokenError, Transformer } from '../../src';
import { ParserOptionMissingContentError } from '../../src/lib/errors/ParserOptionMissingContentError';
import { ParserPickMissingOptionsError } from '../../src/lib/errors/ParserPickMissingOptionsError';

describe('Lexer', () => {
	Transformer.kFormatters.set('uppercase', (value) => value.toUpperCase());

	test('Basic Parser', () => {
		const lexer = new Lexer('');
		const parser = new Parser(lexer);
		expect(parser.kParts).not.toBe(lexer);
	});

	test('Basic Tag', () => {
		const parser = new Parser(new Lexer('{number}'));
		expect(() => parser.parse()).not.toThrow();
	});

	test('Basic Named Tag', () => {
		const parser = new Parser(new Lexer('{name:number}'));
		expect(() => parser.parse()).not.toThrow();
	});

	test('Basic Pick Tag', () => {
		const parser = new Parser(new Lexer('{pick =something{Hi!}}'));
		expect(() => parser.parse()).not.toThrow();
	});

	test('Basic Pick Tag | Multiple Words', () => {
		const parser = new Parser(new Lexer('{pick =something{Hello World!}}'));
		expect(() => parser.parse()).not.toThrow();
	});

	test('Basic Pick Tag With Fallback', () => {
		const parser = new Parser(new Lexer('{pick =something{Hi!} ={Fallback!}}'));
		expect(() => parser.parse()).not.toThrow();
	});

	test('Basic Tag With Transformers', () => {
		const parser = new Parser(new Lexer('{number | uppercase}'));
		expect(() => parser.parse()).not.toThrow();
	});

	test('Basic Named Tag With Transformers', () => {
		const parser = new Parser(new Lexer('{name:number | uppercase}'));
		expect(() => parser.parse()).not.toThrow();
	});

	test('Basic Pick Tag With Transformers', () => {
		const parser = new Parser(new Lexer('{pick =something{Hi!} | uppercase}'));
		expect(() => parser.parse()).not.toThrow();
	});

	test('Basic Pick Tag With Fallback & Transformers', () => {
		const parser = new Parser(new Lexer('{pick =something{Hi!} ={Fallback!} | uppercase}'));
		expect(() => parser.parse()).not.toThrow();
	});

	test('Invalid | Tag | Expected Token', () => {
		const parser = new Parser(new Lexer('{'));
		expect(() => parser.parse()).toThrow(ParserMissingTokenError);
	});

	test('Invalid | Tag | Invalid Token (Expected Literal, Received Equals)', () => {
		const parser = new Parser(new Lexer('{='));
		expect(() => parser.parse()).toThrow(ParserUnexpectedTokenError);
	});

	test('Invalid | Pick | Missing Options', () => {
		const parser = new Parser(new Lexer('{pick}'));
		expect(() => parser.parse()).toThrow(ParserPickMissingOptionsError);
	});

	test('Invalid | Options | Invalid Token (Expected Literal or TagOpen, Received Equals)', () => {
		const parser = new Parser(new Lexer('{pick ==}'));
		expect(() => parser.parse()).toThrow(ParserUnexpectedTokenError);
	});

	test('Invalid | Options | Missing Content', () => {
		const parser = new Parser(new Lexer('{pick ={}}'));
		expect(() => parser.parse()).toThrow(ParserOptionMissingContentError);
	});
});

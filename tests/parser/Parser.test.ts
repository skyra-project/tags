import {
	Lexer,
	Parser,
	ParserMissingTokenError,
	ParserUnexpectedTokenError,
	Pick,
	PickMapKey,
	PickMapValue,
	SentencePartType,
	Tag,
	Transformer
} from '../../src';
import { ParserEmptyStringTagError } from '../../src/lib/errors/ParserEmptyStringTagError';
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

		const pick = null;
		const value = new Tag('', 'number', pick, []);
		expect(parser.parse()).toStrictEqual([{ type: SentencePartType.Tag, value }]);
	});

	test('Basic Named Tag', () => {
		const parser = new Parser(new Lexer('{name:number}'));

		const pick = null;
		const value = new Tag('name', 'number', pick, []);
		expect(parser.parse()).toStrictEqual([{ type: SentencePartType.Tag, value }]);
	});

	test('Basic Pick Tag', () => {
		const parser = new Parser(new Lexer('{pick =something{Hi!}}'));

		const pick = new Pick(new Map([['something', 'Hi!']]));
		const value = new Tag('', 'pick', pick, []);
		expect(parser.parse()).toStrictEqual([{ type: SentencePartType.Tag, value }]);
	});

	test('Basic Pick Tag | Multiple Words', () => {
		const parser = new Parser(new Lexer('{pick =something{Hello World!}}'));

		const pick = new Pick(new Map([['something', 'Hello World!']]));
		const value = new Tag('', 'pick', pick, []);
		expect(parser.parse()).toStrictEqual([{ type: SentencePartType.Tag, value }]);
	});

	test('Basic Pick Tag With Fallback', () => {
		const parser = new Parser(new Lexer('{pick =something{Hi!} ={Fallback!}}'));

		const pick = new Pick(
			new Map<PickMapKey, PickMapValue>([
				['something', 'Hi!'],
				[Pick.kFallback, 'Fallback!']
			])
		);
		const value = new Tag('', 'pick', pick, []);
		expect(parser.parse()).toStrictEqual([{ type: SentencePartType.Tag, value }]);
	});

	test('Basic Tag With Transformers', () => {
		const parser = new Parser(new Lexer('{number | uppercase}'));

		const pick = null;
		const value = new Tag('', 'number', pick, [new Transformer('uppercase')]);
		expect(parser.parse()).toStrictEqual([{ type: SentencePartType.Tag, value }]);
	});

	test('Basic Named Tag With Transformers', () => {
		const parser = new Parser(new Lexer('{name:number | uppercase}'));

		const pick = null;
		const value = new Tag('name', 'number', pick, [new Transformer('uppercase')]);
		expect(parser.parse()).toStrictEqual([{ type: SentencePartType.Tag, value }]);
	});

	test('Basic Pick Tag With Transformers', () => {
		const parser = new Parser(new Lexer('{pick =something{Hi!} | uppercase}'));

		const pick = new Pick(new Map([['something', 'Hi!']]));
		const value = new Tag('', 'pick', pick, [new Transformer('uppercase')]);
		expect(parser.parse()).toStrictEqual([{ type: SentencePartType.Tag, value }]);
	});

	test('Basic Pick Tag With Fallback & Transformers', () => {
		const parser = new Parser(new Lexer('{pick =something{Hi!} ={Fallback!} | uppercase}'));

		const pick = new Pick(
			new Map<PickMapKey, PickMapValue>([
				['something', 'Hi!'],
				[Pick.kFallback, 'Fallback!']
			])
		);
		const value = new Tag('', 'pick', pick, [new Transformer('uppercase')]);
		expect(parser.parse()).toStrictEqual([{ type: SentencePartType.Tag, value }]);
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
		expect(() => parser.parse()).toThrow(ParserEmptyStringTagError);
	});
});

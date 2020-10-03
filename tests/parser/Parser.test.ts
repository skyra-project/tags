import {
	Lexer,
	Parser,
	ParserEmptyStringTagError,
	ParserMissingTokenError,
	ParserPickMissingOptionsError,
	ParserRandomDuplicatedOptionsError,
	ParserRandomMissingOptionsError,
	ParserUnexpectedTokenError,
	Pick,
	PickMapKey,
	PickMapValue,
	Random,
	SentencePartType,
	Tag,
	Transformer
} from '../../src';

describe('Parser', () => {
	Transformer.kFormatters.set('uppercase', (value) => value.toUpperCase());

	test('Basic Parser', () => {
		const lexer = new Lexer('');
		const parser = new Parser(lexer);
		expect(parser.kParts).not.toBe(lexer);
	});

	test('Basic Tag', () => {
		const parser = new Parser(new Lexer('{number}'));

		const modifier = null;
		const value = new Tag('', 'number', modifier, []);
		expect(parser.parse()).toStrictEqual([{ type: SentencePartType.Tag, value }]);
	});

	test('Basic Named Tag', () => {
		const parser = new Parser(new Lexer('{name:number}'));

		const modifier = null;
		const value = new Tag('name', 'number', modifier, []);
		expect(parser.parse()).toStrictEqual([{ type: SentencePartType.Tag, value }]);
	});

	test('Basic Pick Tag', () => {
		const parser = new Parser(new Lexer('{pick =something{Hi!}}'));

		const modifier = new Pick(new Map([['something', 'Hi!']]));
		const value = new Tag('', 'pick', modifier, []);
		expect(parser.parse()).toStrictEqual([{ type: SentencePartType.Tag, value }]);
	});

	test('Basic Pick Tag | Multiple Words', () => {
		const parser = new Parser(new Lexer('{pick =something{Hello World!}}'));

		const modifier = new Pick(new Map([['something', 'Hello World!']]));
		const value = new Tag('', 'pick', modifier, []);
		expect(parser.parse()).toStrictEqual([{ type: SentencePartType.Tag, value }]);
	});

	test('Basic Pick Tag With Fallback', () => {
		const parser = new Parser(new Lexer('{pick =something{Hi!} ={Fallback!}}'));

		const modifier = new Pick(
			new Map<PickMapKey, PickMapValue>([
				['something', 'Hi!'],
				[Pick.kFallback, 'Fallback!']
			])
		);
		const value = new Tag('', 'pick', modifier, []);
		expect(parser.parse()).toStrictEqual([{ type: SentencePartType.Tag, value }]);
	});

	test('Basic Random Tag', () => {
		const parser = new Parser(new Lexer('{random {Hey} {Hello there}}'));

		const modifier = new Random(['Hey', 'Hello there']);
		const value = new Tag('', 'random', modifier, []);
		expect(parser.parse()).toStrictEqual([{ type: SentencePartType.Tag, value }]);
	});

	test('Basic Tag With Transformers', () => {
		const parser = new Parser(new Lexer('{number | uppercase}'));

		const modifier = null;
		const value = new Tag('', 'number', modifier, [new Transformer('uppercase')]);
		expect(parser.parse()).toStrictEqual([{ type: SentencePartType.Tag, value }]);
	});

	test('Basic Named Tag With Transformers', () => {
		const parser = new Parser(new Lexer('{name:number | uppercase}'));

		const modifier = null;
		const value = new Tag('name', 'number', modifier, [new Transformer('uppercase')]);
		expect(parser.parse()).toStrictEqual([{ type: SentencePartType.Tag, value }]);
	});

	test('Basic Pick Tag With Transformers', () => {
		const parser = new Parser(new Lexer('{pick =something{Hi!} | uppercase}'));

		const modifier = new Pick(new Map([['something', 'Hi!']]));
		const value = new Tag('', 'pick', modifier, [new Transformer('uppercase')]);
		expect(parser.parse()).toStrictEqual([{ type: SentencePartType.Tag, value }]);
	});

	test('Basic Pick Tag With Fallback & Transformers', () => {
		const parser = new Parser(new Lexer('{pick =something{Hi!} ={Fallback!} | uppercase}'));

		const modifier = new Pick(
			new Map<PickMapKey, PickMapValue>([
				['something', 'Hi!'],
				[Pick.kFallback, 'Fallback!']
			])
		);
		const value = new Tag('', 'pick', modifier, [new Transformer('uppercase')]);
		expect(parser.parse()).toStrictEqual([{ type: SentencePartType.Tag, value }]);
	});

	test('Basic Random Tag With Transformers', () => {
		const parser = new Parser(new Lexer('{random {Hey} {Hello there} | uppercase}'));

		const modifier = new Random(['Hey', 'Hello there']);
		const value = new Tag('', 'random', modifier, [new Transformer('uppercase')]);
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

	test('Invalid | Random | Missing Items (0 items)', () => {
		const parser = new Parser(new Lexer('{random}'));
		expect(() => parser.parse()).toThrow(ParserRandomMissingOptionsError);
	});

	test('Invalid | Random | Missing Items (1 items)', () => {
		const parser = new Parser(new Lexer('{random {hey}}'));
		expect(() => parser.parse()).toThrow(ParserRandomMissingOptionsError);
	});

	test('Invalid | Random | Duplicated Items (2 items)', () => {
		const parser = new Parser(new Lexer('{random {hey} {hey}}'));
		expect(() => parser.parse()).toThrow(ParserRandomDuplicatedOptionsError);
	});
});

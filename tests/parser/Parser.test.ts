import {
	Lexer,
	MismatchingNamedArgumentTypeValidationError,
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
	Transformer.formatters.set('uppercase', (value) => value.toUpperCase());

	test('Basic Parser | Lexer Overload', () => {
		const lexer = new Lexer('');
		const parser = new Parser(lexer);
		expect(parser.input).not.toBe(lexer);
	});

	test('Basic Parser | Iterator Overload', () => {
		const lexer = new Lexer('');
		const iterator = lexer[Symbol.iterator]();
		const parser = new Parser(iterator);
		expect(parser.input).toBe(iterator);
	});

	test('Basic Literal', () => {
		const parser = new Parser(new Lexer('Hello world!'));
		expect(parser.parse()).toStrictEqual([{ type: SentencePartType.Literal, value: 'Hello world!' }]);
	});

	test('Literal + Tag', () => {
		const parser = new Parser(new Lexer('Hello world! {number}'));
		expect(parser.parse()).toStrictEqual([
			{ type: SentencePartType.Literal, value: 'Hello world! ' },
			{ type: SentencePartType.Tag, value: new Tag('', 'number', null, []) }
		]);
	});

	test('Tag + Literal', () => {
		const parser = new Parser(new Lexer('{number} Hello world!'));
		expect(parser.parse()).toStrictEqual([
			{ type: SentencePartType.Tag, value: new Tag('', 'number', null, []) },
			{ type: SentencePartType.Literal, value: ' Hello world!' }
		]);
	});

	test('Literal + Tag + Literal', () => {
		const parser = new Parser(new Lexer('Hello! Your pick was: {number}!'));
		expect(parser.parse()).toStrictEqual([
			{ type: SentencePartType.Literal, value: 'Hello! Your pick was: ' },
			{ type: SentencePartType.Tag, value: new Tag('', 'number', null, []) },
			{ type: SentencePartType.Literal, value: '!' }
		]);
	});

	test('Tokens As Literal', () => {
		const parser = new Parser(new Lexer(' }=:|'));
		expect(parser.parse()).toStrictEqual([{ type: SentencePartType.Literal, value: ' }=:|' }]);
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
				[Pick.fallback, 'Fallback!']
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
				[Pick.fallback, 'Fallback!']
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

	test('Basic Tag Check', () => {
		const parser = new Parser(new Lexer('{string} {string}'));

		const modifier = null;
		const values = [
			{ type: SentencePartType.Tag, value: new Tag('', 'string', modifier, []) },
			{ type: SentencePartType.Literal, value: ' ' },
			{ type: SentencePartType.Tag, value: new Tag('', 'string', modifier, []) }
		] as const;
		expect(parser.parse()).toStrictEqual(values);
		expect(() => parser.check()).not.toThrow();
	});

	test('Basic Named Tag Check', () => {
		const parser = new Parser(new Lexer('{a:string} {a:string}'));

		const modifier = null;
		const values = [
			{ type: SentencePartType.Tag, value: new Tag('a', 'string', modifier, []) },
			{ type: SentencePartType.Literal, value: ' ' },
			{ type: SentencePartType.Tag, value: new Tag('a', 'string', modifier, []) }
		] as const;
		expect(parser.parse()).toStrictEqual(values);
		expect(() => parser.check()).not.toThrow();
	});

	test('Invalid | Tag | Expected Token (Literal)', () => {
		const parser = new Parser(new Lexer('{'));
		expect(() => parser.parse()).toThrow(ParserMissingTokenError);
	});

	test('Invalid | Tag | Invalid Token (Expected Literal, Received Equals)', () => {
		const parser = new Parser(new Lexer('{='));
		expect(() => parser.parse()).toThrow(ParserUnexpectedTokenError);
	});

	test('Invalid | Tag | Invalid Token After Name (Expected Colon, Pipe, of TagEnd, Received TagStart)', () => {
		const parser = new Parser(new Lexer('{thing {'));
		expect(() => parser.parse()).toThrow(ParserUnexpectedTokenError);
	});

	test('Invalid | Tag | Invalid Token After Name (Expected Colon, Pipe, of TagEnd, Received Equals)', () => {
		const parser = new Parser(new Lexer('{thing ='));
		expect(() => parser.parse()).toThrow(ParserUnexpectedTokenError);
	});

	test('Invalid | Pick | Missing Options', () => {
		const parser = new Parser(new Lexer('{pick}'));
		expect(() => parser.parse()).toThrow(ParserPickMissingOptionsError);
	});

	test('Invalid | Pick | Unexpected Token (Expected Equals, Received Literal)', () => {
		const parser = new Parser(new Lexer('{pick something}'));
		expect(() => parser.parse()).toThrow(ParserUnexpectedTokenError);
	});

	test('Invalid | Pick | Unexpected Token (Expected TagStart, Received TagEnd)', () => {
		const parser = new Parser(new Lexer('{pick =something}'));
		expect(() => parser.parse()).toThrow(ParserUnexpectedTokenError);
	});

	test('Invalid | Pick | Expected Token (TagStart)', () => {
		const parser = new Parser(new Lexer('{pick =something'));
		expect(() => parser.parse()).toThrow(ParserMissingTokenError);
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

	test('Invalid | Check | Mismatching Types (Expected string, Received number)', () => {
		const parser = new Parser(new Lexer('{a:number} {a:string}'));

		const modifier = null;
		const values = [
			{ type: SentencePartType.Tag, value: new Tag('a', 'number', modifier, []) },
			{ type: SentencePartType.Literal, value: ' ' },
			{ type: SentencePartType.Tag, value: new Tag('a', 'string', modifier, []) }
		] as const;
		expect(parser.parse()).toStrictEqual(values);
		expect(() => parser.check()).toThrow(MismatchingNamedArgumentTypeValidationError);
	});
});

import { Lexer, PartType } from '../../src';

describe('Lexer', () => {
	test('No Tokens', () => {
		expect([...new Lexer('')]).toStrictEqual([]);
	});

	test('Space Token', () => {
		expect([...new Lexer(' ')]).toStrictEqual([
			{
				type: PartType.Space
			}
		]);
	});

	test('TagStart Token', () => {
		expect([...new Lexer('{')]).toStrictEqual([
			{
				type: PartType.TagStart
			}
		]);
	});

	test('TagEnd Token', () => {
		expect([...new Lexer('}')]).toStrictEqual([
			{
				type: PartType.TagEnd
			}
		]);
	});

	test('Equals Token', () => {
		expect([...new Lexer('=')]).toStrictEqual([
			{
				type: PartType.Equals
			}
		]);
	});

	test('Colon Token', () => {
		expect([...new Lexer(':')]).toStrictEqual([
			{
				type: PartType.Colon
			}
		]);
	});

	test('Pipe Token', () => {
		expect([...new Lexer('|')]).toStrictEqual([
			{
				type: PartType.Pipe
			}
		]);
	});

	test('Literal Token', () => {
		expect([...new Lexer('Hello')]).toStrictEqual([
			{
				type: PartType.Literal,
				value: 'Hello'
			}
		]);
	});

	test('Spaced Literal Tokens', () => {
		expect([...new Lexer('Hello World')]).toStrictEqual([
			{
				type: PartType.Literal,
				value: 'Hello'
			},
			{
				type: PartType.Space
			},
			{
				type: PartType.Literal,
				value: 'World'
			}
		]);
	});

	test('Simple Tag', () => {
		expect([...new Lexer('{target:user}')]).toStrictEqual([
			{
				type: PartType.TagStart
			},
			{
				type: PartType.Literal,
				value: 'target'
			},
			{
				type: PartType.Colon
			},
			{
				type: PartType.Literal,
				value: 'user'
			},
			{
				type: PartType.TagEnd
			}
		]);
	});
});

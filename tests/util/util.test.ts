import { parse } from '../../src';

describe('Util', () => {
	test('parse + toString | Literal Only', () => {
		const content = 'Hello!';
		const sentence = parse(content);
		expect(sentence.toString()).toBe(content);
	});

	test('parse + toString | Tag Only', () => {
		const content = '{name:string | uppercase}';
		const sentence = parse(content);
		expect(sentence.toString()).toBe(content);
	});

	test('parse + toString | Literal with Tags', () => {
		const content = 'Hello {name:string | uppercase}!';
		const sentence = parse(content);
		expect(sentence.toString()).toBe(content);
	});
});

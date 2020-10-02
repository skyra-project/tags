import { Pick, PickMapKey, PickMapValue, Tag, Transformer } from '../../src';

describe('Tag', () => {
	Transformer.kFormatters.set('uppercase', (value) => value.toUpperCase());

	test('Empty Tag', () => {
		const tag = new Tag('name', 'type', null, []);
		expect(tag.kName).toBe('name');
		expect(tag.kType).toBe('type');
		expect(tag.run('hello')).toBe('hello');
	});

	test('Tag Empty Name', () => {
		const tag = new Tag('', 'type', null, []);
		expect(tag.kName).toBe(null);
		expect(tag.kType).toBe('type');
	});

	test('Tag Empty Type', () => {
		const tag = new Tag('name', '', null, []);
		expect(tag.kName).toBe('name');
		expect(tag.kType).toBe(null);
	});

	test('Tag With Pick', () => {
		const map = new Map<PickMapKey, PickMapValue>([
			['foo', 'bar'],
			[Pick.kFallback, 'woo!']
		]);
		const pick = new Pick(map);
		const tag = new Tag('name', 'type', pick, []);
		expect(tag.kName).toBe('name');
		expect(tag.kType).toBe('type');
		expect(tag.run('hello')).toBe('woo!');
	});

	test('Tag With Formatter', () => {
		const tag = new Tag('name', 'type', null, [new Transformer('uppercase')]);
		expect(tag.kName).toBe('name');
		expect(tag.kType).toBe('type');
		expect(tag.run('hello')).toBe('HELLO');
	});

	test('Tag With Pick And Formatter', () => {
		const map = new Map<PickMapKey, PickMapValue>([
			['foo', 'bar'],
			[Pick.kFallback, 'woo!']
		]);
		const pick = new Pick(map);
		const tag = new Tag('name', 'type', pick, [new Transformer('uppercase')]);
		expect(tag.kName).toBe('name');
		expect(tag.kType).toBe('type');
		expect(tag.run('hello')).toBe('WOO!');
	});
});

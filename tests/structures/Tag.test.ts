import { Pick, PickMapKey, PickMapValue, Tag, Transformer } from '../../src';

describe('Tag', () => {
	test('Empty Tag', () => {
		const tag = new Tag('name', 'type', null, []);
		expect(tag.name).toBe('name');
		expect(tag.type).toBe('type');
		expect(tag.run('hello')).toBe('hello');
	});

	test('Tag Empty Name', () => {
		const tag = new Tag('', 'type', null, []);
		expect(tag.name).toBe(null);
		expect(tag.type).toBe('type');
	});

	test('Tag Empty Type', () => {
		const tag = new Tag('name', '', null, []);
		expect(tag.name).toBe('name');
		expect(tag.type).toBe('string');
	});

	test('Tag With Pick', () => {
		const map = new Map<PickMapKey, PickMapValue>([
			['foo', 'bar'],
			[Pick.fallback, 'woo!']
		]);
		const pick = new Pick(map);
		const tag = new Tag('name', 'type', pick, []);
		expect(tag.name).toBe('name');
		expect(tag.type).toBe('type');
		expect(tag.run('hello')).toBe('woo!');
	});

	test('Tag With Formatter', () => {
		const tag = new Tag('name', 'type', null, [new Transformer('uppercase')]);
		expect(tag.name).toBe('name');
		expect(tag.type).toBe('type');
		expect(tag.run('hello')).toBe('HELLO');
	});

	test('toString | Tag With Pick And Formatter', () => {
		const map = new Map<PickMapKey, PickMapValue>([
			['foo', 'bar'],
			[Pick.fallback, 'woo!']
		]);
		const pick = new Pick(map);
		const tag = new Tag('name', 'type', pick, [new Transformer('uppercase')]);
		expect(tag.toString()).toBe('{name:pick =foo{bar} ={woo!} | uppercase}');
	});

	test('toString | Empty Tag', () => {
		const tag = new Tag('name', 'type', null, []);
		expect(tag.toString()).toBe('{name:type}');
	});

	test('toString | Tag Empty Name', () => {
		const tag = new Tag('', 'type', null, []);
		expect(tag.toString()).toBe('{type}');
	});

	test('toString | Tag Empty Type', () => {
		const tag = new Tag('name', '', null, []);
		expect(tag.toString()).toBe('{name:string}');
	});

	test('toString | Tag With Pick', () => {
		const map = new Map<PickMapKey, PickMapValue>([
			['foo', 'bar'],
			[Pick.fallback, 'woo!']
		]);
		const pick = new Pick(map);
		const tag = new Tag('name', 'type', pick, []);
		expect(tag.toString()).toBe('{name:pick =foo{bar} ={woo!}}');
	});

	test('toString | Tag With Formatter', () => {
		const tag = new Tag('name', 'type', null, [new Transformer('uppercase')]);
		expect(tag.toString()).toBe('{name:type | uppercase}');
	});

	test('toString | Tag With Pick And Formatter', () => {
		const map = new Map<PickMapKey, PickMapValue>([
			['foo', 'bar'],
			[Pick.fallback, 'woo!']
		]);
		const pick = new Pick(map);
		const tag = new Tag('name', 'type', pick, [new Transformer('uppercase')]);
		expect(tag.toString()).toBe('{name:pick =foo{bar} ={woo!} | uppercase}');
	});
});

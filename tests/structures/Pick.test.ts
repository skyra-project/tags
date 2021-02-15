import { Pick, PickInvalidOptionError, PickMapKey, PickMapValue } from '../../src';

describe('Pick', () => {
	test('No Options', () => {
		expect(() => new Pick(new Map()).run('Not Exists!')).toThrow(PickInvalidOptionError);
	});

	test('Valid Option', () => {
		const map = new Map<PickMapKey, PickMapValue>([['foo', 'bar']]);
		const pick = new Pick(map);
		expect(pick.run('foo')).toBe('bar');
	});

	test('Fallback Option', () => {
		const map = new Map<PickMapKey, PickMapValue>([
			['foo', 'bar'],
			[Pick.fallback, 'woo!']
		]);
		const pick = new Pick(map);
		expect(pick.run('invalid')).toBe('woo!');
	});
});

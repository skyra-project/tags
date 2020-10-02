import { CharacterStream } from '../../src/lib/parser/CharacterStream';

describe('CharacterStream', () => {
	test('No Characters', () => {
		expect(new CharacterStream('').next()).toBe(false);
	});

	test('Initial Peek', () => {
		expect(new CharacterStream('').peek()).toBe('');
	});

	test('One ASCII Characters', () => {
		const cs = new CharacterStream('a');
		expect(cs.next()).toBe(true);
		expect(cs.peek()).toBe('a');
		expect(cs.next()).toBe(false);
	});

	test('One UTF-16 Characters', () => {
		const cs = new CharacterStream('🔥');
		expect(cs.next()).toBe(true);
		expect(cs.peek()).toBe('🔥');
		expect(cs.next()).toBe(false);
	});
});

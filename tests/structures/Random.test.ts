import { Random } from '../../src';

describe('Random', () => {
	test('Valid Option', () => {
		const modifier = new Random(['Hey', 'Hello there']);

		vi.spyOn(global.Math, 'random').mockImplementationOnce(() => 0.1);
		expect(modifier.run()).toBe('Hey');

		vi.spyOn(global.Math, 'random').mockImplementationOnce(() => 0.6);
		expect(modifier.run()).toBe('Hello there');
	});

	test('toString | Valid Option', () => {
		const modifier = new Random(['Hey', 'Hello there']);
		expect(modifier.toString()).toBe('random {Hey} {Hello there}');
	});
});

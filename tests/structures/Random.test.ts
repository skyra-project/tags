import { Random } from '../../src';

describe('Random', () => {
	test('Valid Option', () => {
		const modifier = new Random(['Hey', 'Hello there']);

		jest.spyOn(global.Math, 'random').mockImplementationOnce(() => 0.1);
		expect(modifier.run()).toBe('Hey');

		jest.spyOn(global.Math, 'random').mockImplementationOnce(() => 0.6);
		expect(modifier.run()).toBe('Hello there');
	});
});

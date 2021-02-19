import { Sentence, SentencePartType, Tag, Transformer } from '../../src';

describe('Sentence', () => {
	test('Literal Only', () => {
		const sentence = new Sentence([
			{ type: SentencePartType.Literal, value: 'Hello!' } //
		]);

		const iterator = sentence.run();
		const result = iterator.next();
		expect(result.done).toBe(true);
		expect(result.value).toBe('Hello!');
	});

	test('Tag Only', () => {
		const sentence = new Sentence([
			{ type: SentencePartType.Tag, value: new Tag('name', '', null, [new Transformer('uppercase')]) } //
		]);

		const iterator = sentence.run();

		let result = iterator.next();
		expect(result.done).toBe(false);
		expect((result.value as Tag).name).toBe('name');

		result = iterator.next('kyra');
		expect(result.done).toBe(true);
		expect(result.value).toBe('KYRA');
	});

	test('Literal with Tags', () => {
		const sentence = new Sentence([
			{ type: SentencePartType.Literal, value: 'Hello ' },
			{ type: SentencePartType.Tag, value: new Tag('name', '', null, [new Transformer('uppercase')]) },
			{ type: SentencePartType.Literal, value: '!' }
		]);

		const iterator = sentence.run();

		let result = iterator.next();
		expect(result.done).toBe(false);
		expect(result.value instanceof Tag).toBe(true);

		result = iterator.next('kyra');
		expect(result.done).toBe(true);
		expect(result.value).toBe('Hello KYRA!');
	});

	test('Literal with Named Tags', () => {
		const sentence = new Sentence([
			{ type: SentencePartType.Tag, value: new Tag('name', '', null, []) },
			{ type: SentencePartType.Literal, value: '? Oh! You are that ' },
			{ type: SentencePartType.Tag, value: new Tag('name', '', null, [new Transformer('uppercase')]) },
			{ type: SentencePartType.Literal, value: ' everyone talked about!' }
		]);

		const iterator = sentence.run();

		let result = iterator.next();
		expect(result.done).toBe(false);
		expect(result.value instanceof Tag).toBe(true);

		result = iterator.next('kyra');
		expect(result.done).toBe(true);
		expect(result.value).toBe('kyra? Oh! You are that KYRA everyone talked about!');
	});

	test('toString | Literal Only', () => {
		const sentence = new Sentence([
			{ type: SentencePartType.Literal, value: 'Hello!' } //
		]);

		expect(sentence.toString()).toBe('Hello!');
	});

	test('toString | Tag Only', () => {
		const sentence = new Sentence([
			{ type: SentencePartType.Tag, value: new Tag('name', '', null, [new Transformer('uppercase')]) } //
		]);

		expect(sentence.toString()).toBe('{name:string | uppercase}');
	});

	test('toString | Literal with Tags', () => {
		const sentence = new Sentence([
			{ type: SentencePartType.Literal, value: 'Hello ' },
			{ type: SentencePartType.Tag, value: new Tag('name', '', null, [new Transformer('uppercase')]) },
			{ type: SentencePartType.Literal, value: '!' }
		]);

		expect(sentence.toString()).toBe('Hello {name:string | uppercase}!');
	});

	test('toJSON() | Equals toString', () => {
		const sentence = new Sentence([
			{ type: SentencePartType.Literal, value: 'Hello ' },
			{ type: SentencePartType.Tag, value: new Tag('name', '', null, [new Transformer('uppercase')]) },
			{ type: SentencePartType.Literal, value: '!' }
		]);

		expect(sentence.toJSON()).toBe(sentence.toString());
	});
});

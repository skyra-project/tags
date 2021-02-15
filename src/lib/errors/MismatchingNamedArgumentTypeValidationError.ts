import type { Tag } from '../structures/Tag';

export class MismatchingNamedArgumentTypeValidationError extends Error {
	public readonly expected: Tag;
	public readonly received: Tag;

	public constructor(expected: Tag, received: Tag) {
		super(`Mismatching named argument types (Expected '${expected.type}' but received '${received.type}').`);
		this.expected = expected;
		this.received = received;
	}
}

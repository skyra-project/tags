import type { Tag } from '../structures/Tag';
import { Identifiers, UserError } from './base/UserError';

export class MismatchingNamedArgumentTypeValidationError extends UserError {
	public readonly expected: Tag;
	public readonly received: Tag;

	public constructor(expected: Tag, received: Tag) {
		super(
			Identifiers.MismatchingNamedArgumentTypeValidation,
			`Mismatching named argument types (Expected '${expected.type}' but received '${received.type}').`
		);
		this.expected = expected;
		this.received = received;
	}
}

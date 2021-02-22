import { Identifiers, UserError } from './base/UserError';

export class ParserEmptyStringTagError extends UserError {
	public constructor() {
		super(Identifiers.ParserEmptyStringTag, 'String tags must have at least one character.');
	}
}

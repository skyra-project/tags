import { Identifiers, UserError } from './base/UserError';

export class ParserRandomMissingOptionsError extends UserError {
	public constructor() {
		super(Identifiers.ParserRandomMissingOptions, 'Random tags must have at least two items.');
	}
}

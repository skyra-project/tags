import { Identifiers, UserError } from './base/UserError';

export class ParserMissingTokenError extends UserError {
	public constructor() {
		super(Identifiers.ParserMissingToken, 'A character was expected, but reached the end of the string.');
	}
}

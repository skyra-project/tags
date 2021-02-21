import { Identifiers, UserError } from './base/UserError';

export class ParserPickMissingOptionsError extends UserError {
	public constructor() {
		super(Identifiers.ParserPickMissingOptions, 'There must be at least one option in pick tags.');
	}
}

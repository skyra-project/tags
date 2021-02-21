import { Identifiers, UserError } from './base/UserError';

export class SentenceMissingArgumentError extends UserError {
	public constructor() {
		super(Identifiers.SentenceMissingArgument, 'An argument must be specified.');
	}
}

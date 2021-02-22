import { Identifiers, UserError } from './base/UserError';

export class ParserRandomDuplicatedOptionsError extends UserError {
	public constructor() {
		super(Identifiers.ParserRandomDuplicatedOptions, 'Random tags cannot have duplicated items.');
	}
}

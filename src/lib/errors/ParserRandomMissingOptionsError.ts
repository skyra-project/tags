export class ParserRandomMissingOptionsError extends SyntaxError {
	public constructor() {
		super('Random tags must have at least two items.');
	}
}

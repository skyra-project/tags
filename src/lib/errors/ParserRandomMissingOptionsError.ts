export class ParserRandomMissingOptionsError extends Error {
	public constructor() {
		super('Random tags must have at least two items.');
	}
}

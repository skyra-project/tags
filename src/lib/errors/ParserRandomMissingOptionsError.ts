export class ParserRandomMissingOptionsError extends Error {
	public constructor() {
		super('A random tag must have at least two items.');
	}
}

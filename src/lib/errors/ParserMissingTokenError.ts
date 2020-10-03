export class ParserMissingTokenError extends Error {
	public constructor() {
		super('A character was expected, but reached the end of the string.');
	}
}

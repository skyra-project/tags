export class ParserMissingTokenError extends SyntaxError {
	public constructor() {
		super('A character was expected, but reached the end of the string.');
	}
}

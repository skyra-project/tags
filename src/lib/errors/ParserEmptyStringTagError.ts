export class ParserEmptyStringTagError extends SyntaxError {
	public constructor() {
		super('String tags must have at least one character.');
	}
}

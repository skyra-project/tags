export class ParserEmptyStringTagError extends Error {
	public constructor() {
		super('String tags must have at least one character.');
	}
}

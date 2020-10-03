export class ParserRandomDuplicatedOptionsError extends SyntaxError {
	public constructor() {
		super('Random tags cannot have duplicated items.');
	}
}

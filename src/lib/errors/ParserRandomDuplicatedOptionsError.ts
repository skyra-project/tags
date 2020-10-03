export class ParserRandomDuplicatedOptionsError extends Error {
	public constructor() {
		super('Random tags cannot have duplicated items.');
	}
}

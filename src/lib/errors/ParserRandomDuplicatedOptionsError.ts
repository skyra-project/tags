export class ParserRandomDuplicatedOptionsError extends Error {
	public constructor() {
		super('A random tag cannot have duplicated items.');
	}
}

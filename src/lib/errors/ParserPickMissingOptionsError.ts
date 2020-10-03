export class ParserPickMissingOptionsError extends Error {
	public constructor() {
		super('There must be at least one option in pick tags.');
	}
}

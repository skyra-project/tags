export class ParserPickMissingOptionsError extends SyntaxError {
	public constructor() {
		super('There must be at least one option in pick tags.');
	}
}

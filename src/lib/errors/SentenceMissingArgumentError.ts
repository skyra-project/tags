export class SentenceMissingArgumentError extends Error {
	public constructor() {
		super('An argument must be specified.');
	}
}

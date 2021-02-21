export const enum Identifiers {
	MismatchingNamedArgumentTypeValidation = 'MismatchingNamedArgumentTypeValidation',
	ParserEmptyStringTag = 'ParserEmptyStringTag',
	ParserMissingToken = 'ParserMissingToken',
	ParserPickMissingOptions = 'ParserPickMissingOptions',
	ParserRandomDuplicatedOptions = 'ParserRandomDuplicatedOptions',
	ParserRandomMissingOptions = 'ParserRandomMissingOptions',
	ParserUnexpectedToken = 'ParserUnexpectedToken',
	PickInvalidOption = 'PickInvalidOption',
	SentenceMissingArgument = 'SentenceMissingArgument',
	TransformerInvalidFormatter = 'TransformerInvalidFormatter'
}

export class UserError extends Error {
	public readonly identifier: Identifiers;
	public constructor(identifier: Identifiers, message: string) {
		super(message);
		this.identifier = identifier;
	}

	public get name() {
		return `${this.constructor.name}[${this.identifier}]`;
	}
}

export const enum Identifiers {
	MismatchingNamedArgumentTypeValidation = 'mismatchingNamedArgumentTypeValidation',
	ParserEmptyStringTag = 'parserEmptyStringTag',
	ParserMissingToken = 'parserMissingToken',
	ParserPickMissingOptions = 'parserPickMissingOptions',
	ParserRandomDuplicatedOptions = 'parserRandomDuplicatedOptions',
	ParserRandomMissingOptions = 'parserRandomMissingOptions',
	ParserUnexpectedToken = 'parserUnexpectedToken',
	PickInvalidOption = 'pickInvalidOption',
	SentenceMissingArgument = 'sentenceMissingArgument',
	TransformerInvalidFormatter = 'transformerInvalidFormatter'
}

export class UserError extends Error {
	public readonly identifier: Identifiers;
	public constructor(identifier: Identifiers, message: string) {
		super(message);
		this.identifier = identifier;
	}

	public get name() {
		return this.constructor.name;
	}
}

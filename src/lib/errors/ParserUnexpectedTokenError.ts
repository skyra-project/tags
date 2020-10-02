import { PartType } from '../parser/Lexer';

export class ParserUnexpectedTokenError extends Error {
	public readonly kExpected: PartType | readonly PartType[];
	public readonly kReceived: PartType;

	public constructor(expected: PartType | PartType[], received: PartType) {
		super(`Expected ${ParserUnexpectedTokenError.getTypeName(expected)}, received ${ParserUnexpectedTokenError.getTypeName(received)}`);
		this.kExpected = expected;
		this.kReceived = received;
	}

	private static getTypeName(type: PartType | PartType[]): string {
		if (Array.isArray(type)) {
			return `(${type.map((v) => this.getTypeName(v)).join(' | ')})`;
		}

		switch (type) {
			case PartType.Space:
				return 'Space';
			case PartType.TagStart:
				return 'TagStart';
			case PartType.TagEnd:
				return 'TagEnd';
			case PartType.Equals:
				return 'Equals';
			case PartType.Colon:
				return 'Colon';
			case PartType.Pipe:
				return 'Pipe';
			case PartType.Literal:
				return 'Literal';
		}
	}
}

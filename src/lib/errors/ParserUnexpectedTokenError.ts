import { PartType } from '../parser/Lexer';
import { Identifiers, UserError } from './base/UserError';

export class ParserUnexpectedTokenError extends UserError {
	public readonly expected: PartType | readonly PartType[];
	public readonly received: PartType;

	public constructor(expected: PartType | PartType[], received: PartType) {
		super(
			Identifiers.ParserUnexpectedToken,
			`Expected ${ParserUnexpectedTokenError.getTypeName(expected)}, received ${ParserUnexpectedTokenError.getTypeName(received)}`
		);
		this.expected = expected;
		this.received = received;
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

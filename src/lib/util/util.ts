import { Lexer } from '../parser/Lexer';
import { Parser } from '../parser/Parser';
import { Sentence } from '../structures/Sentence';

export function parse(content: string) {
	return new Sentence(new Parser(new Lexer(content)).parse());
}

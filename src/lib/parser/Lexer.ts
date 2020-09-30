import { CharacterStream } from './CharacterStream';

export class Lexer {
	private buffer = '';
	// TODO(kyranet): add more information
	private parts: string[] = [];
	private stream: CharacterStream;

	public constructor(str: string) {
		this.stream = new CharacterStream(str);
	}

	private get finished(): boolean {
		return this.stream.finished;
	}

	public parse() {
		while (!this.finished) {
			this.lexStartTag();
			this.stream.next();
		}
	}

	private flush() {
		const { buffer } = this;
		this.buffer = '';
		return buffer;
	}

	private lexStartTag() {
		const first = this.stream.peek();
		if (first !== '{' || !this.stream.next()) {
			this.buffer += first;
			return null;
		}

		const second = this.stream.peek();
		if (second !== '{' || !this.stream.next()) {
			this.buffer += first + second;
			return null;
		}

		return this.lexTag();
	}

	private lexTag() {
		const tmp = this.flush();
		while (!this.finished) {
			if (this.lexEndTag()) {
				this.parts.push(tmp);
				this.parts.push(this.flush());
				return true;
			}

			// TODO(kyranet): lex Type, Pick, and Transformer
		}

		this.buffer = tmp + this.buffer;
		return false;
	}

	private lexEndTag() {
		const first = this.stream.peek();
		if (first !== '}' || !this.stream.next()) {
			this.buffer += first;
			return false;
		}

		const second = this.stream.peek();
		if (second !== '}') {
			this.buffer += first + second;
			return false;
		}

		return true;
	}
}

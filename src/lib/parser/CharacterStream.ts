export class CharacterStream {
	private finished = false;
	private character = '';
	private iterator: IterableIterator<string>;

	public constructor(str: string) {
		this.iterator = str[Symbol.iterator]();
	}

	public peek(): string {
		return this.character;
	}

	public next(): boolean {
		if (this.finished) return false;

		const value = this.iterator.next();

		if (value.done) {
			this.finished = true;
			this.character = '';
			return false;
		}

		this.character = value.value;
		return true;
	}
}

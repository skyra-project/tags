export class CharacterStream {
	private character = '';
	private iterator: IterableIterator<string>;

	public constructor(str: string) {
		this.iterator = str[Symbol.iterator]();
	}

	public peek(): string {
		return this.character;
	}

	public next(): boolean {
		const value = this.iterator.next();

		if (value.done) {
			this.character = '';
			return false;
		}

		this.character = value.value;
		return true;
	}
}

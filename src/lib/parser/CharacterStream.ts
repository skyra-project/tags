/* eslint-disable @typescript-eslint/explicit-member-accessibility */

export class CharacterStream {
	#finished = false;
	#previous = '';
	#character = '';
	#iterator: IterableIterator<string>;

	public constructor(str: string) {
		this.#iterator = str[Symbol.iterator]();
	}

	public get finished(): boolean {
		return this.#finished;
	}

	public previous(): string {
		return this.#previous;
	}

	public peek(): string {
		return this.#character;
	}

	public next(): boolean {
		if (this.finished) return false;

		const value = this.#iterator.next();
		this.#previous = this.#character;

		if (value.done) {
			this.#finished = true;
			this.#character = '';
			return false;
		}

		this.#character = value.value;
		return true;
	}
}

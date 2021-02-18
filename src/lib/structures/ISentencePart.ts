export interface ISentencePart {
	/**
	 * Runs the sentence part's logic.
	 * @param value The value to handle.
	 */
	run(value: string): string;

	/**
	 * Defines the String() behavior for the part.
	 */
	toString(): string;
}

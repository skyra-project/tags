import type { Pick } from '../structures/Pick';

export class PickInvalidOptionError extends Error {
	public readonly pick: Pick;
	public readonly option: string;

	public constructor(pick: Pick, option: string, message: string) {
		super(message);
		this.pick = pick;
		this.option = option;
	}
}

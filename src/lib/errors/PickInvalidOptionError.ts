import type { Pick } from '../structures/Pick';

export class PickInvalidOptionError extends Error {
	public readonly kPick: Pick;
	public readonly kOption: string;

	public constructor(pick: Pick, option: string, message: string) {
		super(message);
		this.kPick = pick;
		this.kOption = option;
	}
}

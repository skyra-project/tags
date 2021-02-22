import type { Pick } from '../structures/Pick';
import { Identifiers, UserError } from './base/UserError';

export class PickInvalidOptionError extends UserError {
	public readonly pick: Pick;
	public readonly option: string;

	public constructor(pick: Pick, option: string) {
		super(Identifiers.PickInvalidOption, `The key ${option} is not a valid option.`);
		this.pick = pick;
		this.option = option;
	}
}

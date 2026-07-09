import { PresenceStatusEnum } from '../enums/presence-status.enum';

export interface PresenceFriend {
	id: string;
	status: PresenceStatusEnum;
}

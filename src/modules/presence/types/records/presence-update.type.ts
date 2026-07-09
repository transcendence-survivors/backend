import { UserListItem } from '@/modules/user/user.public-api';
import { PresenceStatusEnum } from '../enums/presence-status.enum';

interface PresenceNoUpdate {
	broadcastStatus: false;
	broadcastCount: false;
}

interface PresenceBaseUpdate {
	broadcastStatus: true;
	status: PresenceStatusEnum;
}

interface PresenceUpdateWithCount extends PresenceBaseUpdate {
	broadcastCount: true;
	onlineCount: number;
	user: UserListItem;
	newConnection: boolean;
}

interface PresenceUpdateWithoutCount extends PresenceBaseUpdate {
	broadcastCount: false;
	newConnection: false;
}

export type PresenceUpdate =
	PresenceNoUpdate | (PresenceUpdateWithCount | PresenceUpdateWithoutCount);

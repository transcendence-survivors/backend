import { PresenceStatusEnum } from '../enums/presence-status.enum';

export interface PresenceRemove {
	userId?: string;
	isCompletelyOffline: boolean;
}

export interface PresenceDisconnect extends PresenceRemove {
	onlineCount: number;
	status: Extract<PresenceStatusEnum, 'OFFLINE'>;
}

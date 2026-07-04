import { FriendShipStatusDirectionParams } from './friendship-status-direction.params';

export type FriendshipsCountParams = {
	userId: string;
	search?: string;
} & FriendShipStatusDirectionParams;

import { DefaultEventsMap, type Socket } from 'socket.io';
import { type JwtAccessPayload } from '../../security/interfaces/jwt-payload.interface';

type WsUserData = {
	user: JwtAccessPayload | null;
};

type UserWsUserData = {
	user: JwtAccessPayload;
};

type ClientSocket = Socket<
	DefaultEventsMap,
	DefaultEventsMap,
	DefaultEventsMap,
	WsUserData
>;

type UserSocket = Socket<
	DefaultEventsMap,
	DefaultEventsMap,
	DefaultEventsMap,
	UserWsUserData
>;

export type { ClientSocket, UserSocket };

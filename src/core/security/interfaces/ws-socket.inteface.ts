import { DefaultEventsMap, type Socket } from 'socket.io';
import { type JwtAccessPayload } from './jwt-payload.interface';

type WsUserData = {
	user?: JwtAccessPayload;
};

type TypedSocket = Socket<
	DefaultEventsMap,
	DefaultEventsMap,
	DefaultEventsMap,
	WsUserData
>;

export type { TypedSocket };

import { WsServerProvider } from '@/core/websocket/provider/ws-server.provider';
import { Injectable } from '@nestjs/common';
import { PresenceStatusEnum } from '../types/enums/presence-status.enum';
import { UserListItem } from '@/modules/user/user.public-api';
import { PresenceMapper } from '../mappers/presence.mapper';
import { ClientSocket } from '@/core/websocket/interface/ws-socket.inteface';
import { PresenceConnect } from '../types/records/presence-connect.type';
import { PRESENCE_EVENTS } from '../presence.events';

@Injectable()
@Injectable()
export class PresenceBroadcaster {
	constructor(
		private readonly ws: WsServerProvider,
		private readonly mapper: PresenceMapper,
	) {}

	sendInitialState(
		client: ClientSocket,
		result: Pick<PresenceConnect, 'user' | 'activeFriends' | 'status'>,
	) {
		const friendsStatusDtos = result.activeFriends.map((friend) => {
			return this.mapper.toInitialStatusDto(friend.id, friend.status);
		});
		const initialFriendsDto =
			this.mapper.toInitialFriendsDto(friendsStatusDtos);

		const initialStatusDto = this.mapper.toInitialStatusDto(
			result.user.id,
			result.status,
		);

		client.emit(PRESENCE_EVENTS.SEND.INITIAL_FRIENDS, initialFriendsDto);
		client.emit(PRESENCE_EVENTS.SEND.INITIAL_STATUS, initialStatusDto);
	}

	broadcastStatusToFriends(userId: string, status: PresenceStatusEnum) {
		const dto = this.mapper.toUpdatedDto(userId, status);

		this.ws
			.get()
			.to(`presence:${userId}`)
			.emit(PRESENCE_EVENTS.SEND.STATUS_CHANGE, dto);
	}

	broadcastConnectedToFriends(
		user: UserListItem,
		status: PresenceStatusEnum,
	) {
		const dto = this.mapper.toConnectedDto(user, status);

		this.ws
			.get()
			.to(`presence:${user.id}`)
			.emit(PRESENCE_EVENTS.SEND.CONNECTED, dto);
	}

	broadcastOnlineCount(count: number) {
		const dto = this.mapper.toCountDto(count);

		this.ws.get().emit(PRESENCE_EVENTS.SEND.GLOBAL_COUNT, dto);
	}
}

import { WsServerProvider } from '@/core/websocket/provider/ws-server.provider';
import { Injectable } from '@nestjs/common';
import { FriendshipMapper } from '../mappers/friendship.mapper';
import { UserListItem } from '@/contracts/types/user/user-list-item.type';
import { FRIEND_EVENTS } from '../friend.events';
import { type IPresenceStore } from '@/contracts/services/presence/presence-store.port';
import { InjectPresenceStore } from '@/contracts/services/presence/presence-store.inject';

@Injectable()
export class FriendBroadcaster {
	constructor(
		private readonly ws: WsServerProvider,
		private readonly friendMapper: FriendshipMapper,
		@InjectPresenceStore() private presenceStore: IPresenceStore,
	) {}

	notifyFriendRequestAccepted(sender: UserListItem, receiverUserId: string) {
		const isReceiverOnline =
			this.presenceStore.isUserOnline(receiverUserId);
		if (!isReceiverOnline) return;

		const sockets = this.presenceStore.getSocketsByUserId(receiverUserId);
		const payload = this.friendMapper.toFriendRequestDto(sender);
		for (const socketId of sockets) {
			this.ws
				.get()
				.to(socketId)
				.emit(
					FRIEND_EVENTS.SEND.NOTIFICATION_REQUEST_ACCEPTED,
					payload,
				);
		}
	}

	notifyFriendRequestReceived(sender: UserListItem, receiverUserId: string) {
		const isReceiverOnline =
			this.presenceStore.isUserOnline(receiverUserId);
		if (!isReceiverOnline) return;

		const sockets = this.presenceStore.getSocketsByUserId(receiverUserId);
		const payload = this.friendMapper.toFriendRequestDto(sender);

		for (const socketId of sockets) {
			this.ws
				.get()
				.to(socketId)
				.emit(
					FRIEND_EVENTS.SEND.NOTIFICATION_REQUEST_RECEIVED,
					payload,
				);
		}
	}
}

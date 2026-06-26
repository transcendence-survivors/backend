export class FriendRequestCreatedEvent {
	constructor(
		public readonly senderUserId: string,
		public readonly receiverUserId: string,
	) {}
}

export class FriendRequestAcceptedEvent {
	constructor(
		public readonly senderUserId: string,
		public readonly receiverUserId: string,
	) {}
}

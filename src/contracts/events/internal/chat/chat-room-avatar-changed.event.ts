export class ChatRoomAvatarChangedEvent {
	constructor(
		public readonly roomId: string,
		public readonly senderId: string,
		public readonly oldValue: string,
		public readonly newValue: string,
	) {}
}

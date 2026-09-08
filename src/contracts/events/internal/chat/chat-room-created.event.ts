export class ChatRoomCreatedEvent {
	constructor(
		public readonly roomId: string,
		public readonly senderId: string,
	) {}
}

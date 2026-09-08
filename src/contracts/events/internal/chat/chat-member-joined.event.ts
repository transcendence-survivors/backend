export class ChatMemberJoinedEvent {
	constructor(
		public readonly roomId: string,
		public readonly userId: string,
	) {}
}

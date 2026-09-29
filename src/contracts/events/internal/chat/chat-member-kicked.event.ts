export class ChatMemberKickedEvent {
	constructor(
		public readonly roomId: string,
		public readonly senderId: string,
		public readonly targetUserId: string,
	) {}
}

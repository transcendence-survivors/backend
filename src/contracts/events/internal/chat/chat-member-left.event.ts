export class ChatMemberLeftEvent {
	constructor(
		public readonly roomId: string,
		public readonly userId: string,
	) {}
}

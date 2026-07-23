export class ChatMessageSoftDeleteEvent {
	constructor(
		public readonly messageId: string,
		public readonly roomId: string,
	) {}
}

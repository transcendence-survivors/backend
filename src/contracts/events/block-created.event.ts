export class BlockCreatedEvent {
	constructor(
		public readonly blockerUserId: string,
		public readonly blockedUserId: string,
	) {}
}

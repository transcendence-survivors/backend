export class PresenceWentOfflineEvent {
	constructor(
		public readonly userId: string,
		public readonly onlineCount: number,
	) {}
}

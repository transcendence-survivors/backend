export interface ChatTypingUpdatePayload {
	roomId: string;
	userId: string;
	displayName: string;
	isTyping: boolean;
}

export interface ChatMessageCreateParams {
	roomId: string;
	senderId: string;
	content?: string;
	replyToId?: string;
	attachmentUrls?: string[];
}

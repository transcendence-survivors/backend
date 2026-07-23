import { ChatMessageOrderByEnum } from '../enums/chat-message-order-by.enum';

export interface ChatMessagesCursorParams {
	limit: number;
	cursor?: string;
	search?: string;
	orderBy: ChatMessageOrderByEnum;
	userId: string;
	roomId: string;
}

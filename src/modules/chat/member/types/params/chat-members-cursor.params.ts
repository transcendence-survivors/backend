import { ChatMemberOrderByEnum } from '../enums/chat-member-order-by.enum';

export interface ChatMembersCursorParams {
	limit: number;
	cursor?: string;
	search?: string;
	orderBy: ChatMemberOrderByEnum;
	roomId: string;
}

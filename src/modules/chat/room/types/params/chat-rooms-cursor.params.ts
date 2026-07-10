import { ChatRoomFeedEnum } from '../enums/chat-room-feed-enum';
import { ChatRoomOrderByEnum } from '../enums/chat-room-order-by.enum';

export interface ChatRoomsCursorParams {
	limit: number;
	cursor?: string;
	search?: string;
	orderBy: ChatRoomOrderByEnum;
	feedMode: ChatRoomFeedEnum;
	userId: string;
}

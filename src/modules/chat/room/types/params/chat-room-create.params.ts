import { ChatRoomType } from '@prisma-generated/enums';

export interface ChatRoomCreateParams {
	createdBy: string;
	name: string;
	type: ChatRoomType;
	userIds: string[];
}

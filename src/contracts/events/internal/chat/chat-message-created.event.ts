import { ChatMessageListItem } from '@/modules/chat/message/types/records/chat-message-list-item';

export class ChatMessageCreatedEvent {
	constructor(public readonly message: ChatMessageListItem) {}
}

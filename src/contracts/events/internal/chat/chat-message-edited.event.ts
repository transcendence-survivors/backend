import { ChatMessageListItem } from '@/modules/chat/message/types/records/chat-message-list-item';

export class ChatMessageEditedEvent {
	constructor(public readonly message: ChatMessageListItem) {}
}

import { ApiErrorFrom } from '@/shared/decorators/api-error-response.decorator';
import { SelfChatDmException } from '../exceptions/chat-room-bad.exception';
import { ChatRoomDmConflictException } from '../exceptions/chat-room-conflict.exception';
import { ChatRoomNotFoundException } from '../exceptions/chat-room-not-found.exceptions';
import { ChatUserNotFoundException } from '../exceptions/chat-user-not-found.exception';

export const ApiChatRoomSelfDmResponse = () =>
	ApiErrorFrom(SelfChatDmException);

export const ApiChatRoomDmConflictResponse = () =>
	ApiErrorFrom(ChatRoomDmConflictException);

export const ApiChatUserNotFoundResponse = () =>
	ApiErrorFrom(ChatUserNotFoundException);

export const ApiChatRoomNotFoundResponse = () =>
	ApiErrorFrom(ChatRoomNotFoundException);

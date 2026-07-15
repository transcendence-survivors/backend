import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
} from 'class-validator';
import { ChatRoomCreateDto } from './dtos/requests/chat-room-create.dto';
import { ChatRoomType } from '@prisma-generated/enums';

export function ValidUserIdsForRoomType(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'validUserIdsForRoomType',
			target: object.constructor,
			propertyName,
			options: validationOptions,
			validator: {
				validate(userIds: unknown, args: ValidationArguments) {
					if (!Array.isArray(userIds)) return false;
					const { type } = args.object as ChatRoomCreateDto;
					if (type === ChatRoomType.DIRECT) {
						return userIds.length === 1;
					}
					if (type === ChatRoomType.GROUP) {
						return userIds.length >= 1;
					}
					return true;
				},
				defaultMessage(args: ValidationArguments) {
					const { type } = args.object as ChatRoomCreateDto;

					return type === ChatRoomType.DIRECT
						? 'Direct chats must have exactly one recipient.'
						: 'You must invite at least one user to a group chat room.';
				},
			},
		});
	};
}

import { IsUUID } from 'class-validator';

class FriendAcceptDto {
	@IsUUID()
	friendId!: string;
}

export { FriendAcceptDto };

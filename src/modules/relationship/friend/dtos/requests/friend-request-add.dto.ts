import { IsUUID } from 'class-validator';

class FriendRequestAddDto {
	@IsUUID()
	friendId!: string;
}

export { FriendRequestAddDto };

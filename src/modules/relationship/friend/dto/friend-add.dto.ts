import { IsUUID } from 'class-validator';

class FriendAddDto {
	@IsUUID()
	friendId!: string;
}

export { FriendAddDto };

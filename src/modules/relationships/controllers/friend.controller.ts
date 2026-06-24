import { Controller, Post } from '@nestjs/common';

@Controller('friends')
export class FriendController {
	@Post()
	async addFriend() {}
}

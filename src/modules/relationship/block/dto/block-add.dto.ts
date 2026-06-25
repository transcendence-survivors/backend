import { IsUUID } from 'class-validator';

class BlockAddDto {
	@IsUUID()
	blockedUserId!: string;
}

export { BlockAddDto };

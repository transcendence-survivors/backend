import { IsUUID } from 'class-validator';

class BlockAddDto {
	@IsUUID()
	blockedId!: string;
}

export { BlockAddDto };

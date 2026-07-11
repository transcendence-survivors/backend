import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
	@IsOptional()
	@IsString()
	@MinLength(1)
	content?: string;
}

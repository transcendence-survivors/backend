import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
	@IsOptional()
	@IsString()
	@MinLength(1)
	content?: string;
}

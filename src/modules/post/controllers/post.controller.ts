import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dto/post.dto';
import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import type { JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import { PostQueryDto } from '../dto/post-querry.dto';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';

@Controller('posts')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Get()
	@HttpCode(200)
	@ResponseEnvelope('Post fetch successfully')
	async getPosts(@Query() query: PostQueryDto) {
		return this.postService.findCursor(query);
	}

	@Post()
	@HttpCode(201)
	@UseGuards(JWTAccessGuard)
	@ResponseEnvelope('Post created successfully')
	writePost(
		@Body() createPostDto: CreatePostDto,
		@CurrentUser() user: JwtAccessPayload,
	) {
		return this.postService.create(user.sub, createPostDto);
	}

	@Delete(':id')
	@HttpCode(204)
	@UseGuards(JWTAccessGuard)
	async deletePost(
		@Param('id') id: string,
		@CurrentUser() user: JwtAccessPayload,
	) {
		await this.postService.delete(id, user.sub);
	}

	//utiliser this.ok

	//@CurrentUser()user: JwtAccessPayloadParams
	//faire une liste de post que je recupere
	//minimum 1 caractere pour le dto
	//verifier que l'utilisateur est connecte quand il envoie une requete
	//se base sur la route refresh et la strategie des tokens pour comprendre
}

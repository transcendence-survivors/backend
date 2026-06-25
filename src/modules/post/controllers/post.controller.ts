import { BaseController } from '@/common/base.controller';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PostService } from '../services/post.service';
import { AccessTokenGuard } from '@/modules/token/guards/access-token.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { type JwtAccessPayloadParams } from '@/modules/token/strategies/access-token.strategy';
import { CreatePostDto } from '../dto/post.dto';

@Controller('post')
export class PostController extends BaseController {
	constructor(private readonly postService: PostService) {
		super();
	}

	@Get()
	async getAllPosts() {
		return this.postService.findAll();
	}

	@UseGuards(AccessTokenGuard)
	@Post()
	writePost(
		@Body() createPostDto: CreatePostDto,
		@CurrentUser() user: JwtAccessPayloadParams,
	) {
		return this.postService.create(user.userId, createPostDto);
	}

	//@CurrentUser()user: JwtAccessPayloadParams
	//faire une liste de post que je recupere
	//minimum 1 caractere pour le dto
	//verifier que l'utilisateur est connecte quand il envoie une requete
	//se base sur la route refresh et la strategie des tokens pour comprendre
}

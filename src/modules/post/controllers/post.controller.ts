import { BaseController } from '@/shared/base.controller';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dto/post.dto';
import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import type { JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { CurrentUser } from '@/core/security/decorators/current-user.decorator';

@Controller('post')
export class PostController extends BaseController {
	constructor(private readonly postService: PostService) {
		super();
	}

	@Get()
	async getAllPosts() {
		return this.postService.findAll();
	}

	@UseGuards(JWTAccessGuard)
	@Post()
	writePost(
		@Body() createPostDto: CreatePostDto,
		@CurrentUser() user: JwtAccessPayload,
	) {
		return this.postService.create(user.sub, createPostDto);
	}

	//@CurrentUser()user: JwtAccessPayloadParams
	//faire une liste de post que je recupere
	//minimum 1 caractere pour le dto
	//verifier que l'utilisateur est connecte quand il envoie une requete
	//se base sur la route refresh et la strategie des tokens pour comprendre
}

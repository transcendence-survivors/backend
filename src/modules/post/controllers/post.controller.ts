import { BaseController } from '@/shared/base.controller';
import {
	Body,
	Controller,
	Delete,
	Get,
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

@Controller('posts')
export class PostController extends BaseController {
	constructor(private readonly postService: PostService) {
		super();
	}

	@Get('all')
	async getAllPosts() {
		return this.postService.findAll();
	}

	@Get()
	async getPosts(@Query() query: PostQueryDto) {
		const res = await this.postService.findPage(query);
		return this.ok(res, 'Users found');
	}

	@UseGuards(JWTAccessGuard)
	@Post()
	writePost(
		@Body() createPostDto: CreatePostDto,
		@CurrentUser() user: JwtAccessPayload,
	) {
		return this.postService.create(user.sub, createPostDto);
	}

	@UseGuards(JWTAccessGuard)
	@Delete(':id')
	deletePost(@Param('id') id: string, @CurrentUser() user: JwtAccessPayload) {
		return this.postService.delete(id, user.sub);
	}

	//utiliser this.ok

	//@CurrentUser()user: JwtAccessPayloadParams
	//faire une liste de post que je recupere
	//minimum 1 caractere pour le dto
	//verifier que l'utilisateur est connecte quand il envoie une requete
	//se base sur la route refresh et la strategie des tokens pour comprendre
}

import { BaseController } from '@/common/base.controller';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { PostService } from '../services/post.service';
import { AccessTokenGuard } from '@/modules/token/guards/access-token.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import {
	type JwtAccessPayloadParams,
	type JwtAccessPayload,
} from '@/modules/token/strategies/access-token.strategy';

@Controller('post')
export class PostController extends BaseController {
	constructor(private readonly postService: PostService) {
		super();
	}

	//@UseGuards(AccessTokenGuard) que si je veux ecrore
	@Get()
	async getAllPosts() {
		return this.postService.findAll();
	}

	//@CurrentUser()user: JwtAccessPayloadParams
	//faire une liste de post que je recupere
	//minimum 1 caractere pour le dto
	//verifier que l'utilisateur est connecte quand il envoie une requete
	//se base sur la route refresh et la strategie des tokens pour comprendre
}

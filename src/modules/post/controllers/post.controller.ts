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
	UseInterceptors,
	UploadedFile,
	BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dto/post.dto';
import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import type { JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import { PostQueryDto } from '../dto/post-querry.dto';
import { StorageService } from '@/core/storage/services/storage.service';

@Controller('posts')
export class PostController extends BaseController {
	constructor(
		private readonly postService: PostService,
		private readonly storageService: StorageService,
	) {
		super();
	}

	@Get()
	async getPosts(@Query() query: PostQueryDto) {
		const res = await this.postService.findPage(query);
		return this.ok(res, 'Users found');
	}

	@UseGuards(JWTAccessGuard)
	@Post()
	@UseInterceptors(
		FileInterceptor('file', {
			limits: { fileSize: 10 * 1024 * 1024 },
			fileFilter: (_req, file, callback) => {
				if (!file.mimetype.startsWith('image/')) {
					callback(
						new BadRequestException('File must be an image'),
						false,
					);
					return;
				}
				callback(null, true);
			},
		}),
	)
	async writePost(
		@Body() createPostDto: CreatePostDto,
		@CurrentUser() user: JwtAccessPayload,
		@UploadedFile() file: Express.Multer.File,
	) {
		let imageUrl: string | undefined;
		if (file) {
			imageUrl = await this.storageService.upload(
				`posts/${user.sub}-${Date.now()}${extname(file.originalname)}`,
				file.buffer,
				file.mimetype,
			);
		}
		return this.postService.create(user.sub, createPostDto, imageUrl);
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

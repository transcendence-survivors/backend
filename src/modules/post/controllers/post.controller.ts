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
import { PostQueryDto } from '../dto/post-query.dto';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import { ApiNoContentResponse } from '@nestjs/swagger';
import { StorageService } from '@/core/storage/services/storage.service';
import { JWTOptionalAccessGuard } from '@/core/security/guards/jwt-optional-access-guard';

@Controller('posts')
export class PostController {
	constructor(
		private readonly postService: PostService,
		private readonly storageService: StorageService,
	) {}

	@UseGuards(JWTOptionalAccessGuard)
	@Get()
	@HttpCode(200)
	@ResponseEnvelope('Post fetched successfully')
	async getPosts(
		@Query() query: PostQueryDto,
		@CurrentUser() user: JwtAccessPayload | null,
	) {
		return this.postService.findCursor(query, user?.sub);
	}

	@UseGuards(JWTOptionalAccessGuard)
	@Get(':id')
	@HttpCode(200)
	@ResponseEnvelope('Post fetched successfully')
	async getPost(
		@Param('id') id: string,
		@CurrentUser() user: JwtAccessPayload | null,
	) {
		return this.postService.findOne(id, user?.sub);
	}

	@UseGuards(JWTOptionalAccessGuard)
	@Get(':id/replies')
	@HttpCode(200)
	@ResponseEnvelope('Replies fetched successfully')
	async getReplies(
		@Param('id') id: string,
		@Query() query: PostQueryDto,
		@CurrentUser() user: JwtAccessPayload | null,
	) {
		return this.postService.findCursor(query, user?.sub, id);
	}

	@UseGuards(JWTAccessGuard)
	@Post()
	@HttpCode(201)
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
	@ResponseEnvelope('Post created successfully')
	async writePost(
		@Body() { content, parentPostId }: CreatePostDto,
		@CurrentUser() user: JwtAccessPayload,
		@UploadedFile() file: Express.Multer.File,
	) {
		if (!content && !file)
			throw new BadRequestException('Post must have content or an image');
		let imageUrl: string | undefined;
		if (file) {
			imageUrl = await this.storageService.upload({
				fileName: `posts/${user.sub}-${Date.now()}${extname(file.originalname)}`,
				contentType: file.mimetype,
				body: file.buffer,
				bucket: 'post-image',
			});
		}
		try {
			return await this.postService.create(
				user.sub,
				{ content },
				imageUrl,
				parentPostId,
			);
		} catch (err) {
			if (imageUrl) await this.storageService.delete(imageUrl);
			throw err;
		}
	}

	@UseGuards(JWTAccessGuard)
	@Delete(':id')
	@HttpCode(204)
	@ApiNoContentResponse({ description: 'Post deleted successfully' })
	async deletePost(
		@Param('id') id: string,
		@CurrentUser() user: JwtAccessPayload,
	) {
		await this.postService.delete(id, user.sub);
	}
}

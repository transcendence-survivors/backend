import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { CommentService } from '../services/comment.service';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import type { JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { CreateCommentDto } from '../dto/comment.dto';
import { StorageService } from '@/core/storage/services/storage.service';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommentQueryDto } from '../dto/comment-query.dto';
import { JWTOptionalAccessGuard } from '@/core/security/guards/jwt-optional-access-guard';

@UseGuards(JWTAccessGuard)
@Controller('comments')
export class CommentController {
	constructor(
		private readonly commentService: CommentService,
		private readonly storageService: StorageService,
	) {}

	@Post(':postId')
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
	@ResponseEnvelope('comment created successfully')
	async addCommentary(
		@Param('postId') postId: string,
		@CurrentUser() user: JwtAccessPayload,
		@Body() { content }: CreateCommentDto,
		@UploadedFile() file: Express.Multer.File,
	) {
		if (!content && !file)
			throw new BadRequestException(
				'Comment must have content or an image',
			);
		let imageUrl: string | undefined;
		if (file) {
			imageUrl = await this.storageService.upload({
				fileName: `comments/${user.sub}-${Date.now()}${extname(file.originalname)}`,
				contentType: file.mimetype,
				body: file.buffer,
				bucket: 'comment-image',
			});
		}
		try {
			return await this.commentService.create(
				user.sub,
				postId,
				content,
				imageUrl,
			);
		} catch (err) {
			if (imageUrl) await this.storageService.delete(imageUrl);
			throw err;
		}
	}

	@UseGuards(JWTOptionalAccessGuard)
	@Get(':postId')
	@HttpCode(200)
	@ResponseEnvelope('comments fetched successfully')
	async getComments(
		@Param('postId') postId: string,
		@Query() query: CommentQueryDto,
	) {
		return this.commentService.findCursor(postId, query);
	}
}

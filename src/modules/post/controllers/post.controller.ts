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
	HttpStatus,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import { PostCreateDto } from '../dtos/requests/post-create.dto';
import { JWTAccessGuard } from '@/core/security/guards/jwt-access.guard';
import type { JwtAccessPayload } from '@/core/security/interfaces/jwt-payload.interface';
import { CurrentUser } from '@/core/security/decorators/current-user.decorator';
import { PostPaginateDto } from '../dtos/requests/post-paginate.dto';
import { ResponseEnvelope } from '@/shared/decorators/api-response.decorator';
import { ApiParam } from '@nestjs/swagger';
import { InjectUserService } from '@/contracts/services/user/user-service.inject';
import type { IUserService } from '@/contracts/services/user/user-service.port';
import { ApiQueryDto } from '@/shared/decorators/api-query-dto.decorator';
import { ApiBodyDto } from '@/shared/decorators/api-body-dto.decorator';
import {
	ApiCreatedSuccessResponse,
	ApiNoContentSuccessResponse,
	ApiSuccessResponse,
} from '@/shared/decorators/api-success-response.decorator';
import { ApiValidationErrorResponse } from '@/shared/decorators/api-validation-error-response.decorator';
import { PostListItemResponseDto } from '../dtos/responses/post-list-item-response.dto';
import { PostPaginatedListResponseDto } from '../dtos/responses/post-paginated-list-response.dto';
import { PostCreatedResponseDto } from '../dtos/responses/post-created-response.dto';

@Controller('posts')
export class PostController {
	constructor(
		private readonly postService: PostService,
		@InjectUserService() private readonly userService: IUserService,
	) {}

	@UseGuards(JWTAccessGuard)
	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiQueryDto(PostPaginateDto)
	@ApiSuccessResponse(PostPaginatedListResponseDto)
	@ApiValidationErrorResponse({
		limit: ['limit must be a number'],
		orderBy: ['orderBy must be a valid enum value'],
	})
	@ResponseEnvelope('Post fetched successfully')
	async getPosts(
		@Query() query: PostPaginateDto,
		@CurrentUser() user: JwtAccessPayload | null,
	): Promise<PostPaginatedListResponseDto> {
		return this.postService.findCursor(query, user?.sub);
	}

	@UseGuards(JWTAccessGuard)
	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiParam({
		name: 'id',
		description: 'The id of the post to retrieve',
		type: String,
		format: 'uuid',
	})
	@ApiSuccessResponse(PostListItemResponseDto)
	@ResponseEnvelope('Post fetched successfully')
	async getPost(
		@Param('id') id: string,
		@CurrentUser() user: JwtAccessPayload | null,
	): Promise<PostListItemResponseDto> {
		return this.postService.findOne(id, user?.sub);
	}

	@UseGuards(JWTAccessGuard)
	@Get(':id/replies')
	@HttpCode(HttpStatus.OK)
	@ApiParam({
		name: 'id',
		description: 'The id of the post whose replies are listed',
		type: String,
		format: 'uuid',
	})
	@ApiQueryDto(PostPaginateDto)
	@ApiSuccessResponse(PostPaginatedListResponseDto)
	@ResponseEnvelope('Replies fetched successfully')
	async getReplies(
		@Param('id') id: string,
		@Query() query: PostPaginateDto,
		@CurrentUser() user: JwtAccessPayload | null,
	): Promise<PostPaginatedListResponseDto> {
		return this.postService.findCursor(query, user?.sub, id);
	}

	@UseGuards(JWTAccessGuard)
	@Get('user/:username/comments')
	@HttpCode(HttpStatus.OK)
	@ApiParam({
		name: 'username',
		description: 'The username whose comments are listed',
		example: 'johndoe',
	})
	@ApiQueryDto(PostPaginateDto)
	@ApiSuccessResponse(PostPaginatedListResponseDto)
	@ResponseEnvelope('Comments fetched successfully')
	async getUserComments(
		@Param('username') username: string,
		@Query() query: PostPaginateDto,
		@CurrentUser() user: JwtAccessPayload | null,
	): Promise<PostPaginatedListResponseDto> {
		const authorId = await this.userService.getIdByUsername(username);
		return this.postService.findUserComments(authorId, query, user?.sub);
	}

	@UseGuards(JWTAccessGuard)
	@Get('user/:username/reposts')
	@HttpCode(HttpStatus.OK)
	@ApiParam({
		name: 'username',
		description: 'The username whose reposts are listed',
		example: 'johndoe',
	})
	@ApiQueryDto(PostPaginateDto)
	@ApiSuccessResponse(PostPaginatedListResponseDto)
	@ResponseEnvelope('Reposts fetched successfully')
	async getUserReposts(
		@Param('username') username: string,
		@Query() query: PostPaginateDto,
		@CurrentUser() user: JwtAccessPayload | null,
	): Promise<PostPaginatedListResponseDto> {
		const authorId = await this.userService.getIdByUsername(username);
		return this.postService.findUserReposts(authorId, query, user?.sub);
	}

	@UseGuards(JWTAccessGuard)
	@Get('user/:username/likes')
	@HttpCode(HttpStatus.OK)
	@ApiParam({
		name: 'username',
		description: 'The username whose liked posts are listed',
		example: 'johndoe',
	})
	@ApiQueryDto(PostPaginateDto)
	@ApiSuccessResponse(PostPaginatedListResponseDto)
	@ResponseEnvelope('Likes fetched successfully')
	async getUserLikes(
		@Param('username') username: string,
		@Query() query: PostPaginateDto,
		@CurrentUser() user: JwtAccessPayload | null,
	): Promise<PostPaginatedListResponseDto> {
		const userId = await this.userService.getIdByUsername(username);
		return this.postService.findUserLikes(userId, query, user?.sub);
	}

	@UseGuards(JWTAccessGuard)
	@Get('user/:username/posts')
	@HttpCode(HttpStatus.OK)
	@ApiParam({
		name: 'username',
		description: 'The username whose posts are listed',
		example: 'johndoe',
	})
	@ApiQueryDto(PostPaginateDto)
	@ApiSuccessResponse(PostPaginatedListResponseDto)
	@ResponseEnvelope('Posts fetched successfully')
	async getUserPosts(
		@Param('username') username: string,
		@Query() query: PostPaginateDto,
		@CurrentUser() user: JwtAccessPayload | null,
	): Promise<PostPaginatedListResponseDto> {
		const authorId = await this.userService.getIdByUsername(username);
		return this.postService.findUserPosts(authorId, query, user?.sub);
	}

	@UseGuards(JWTAccessGuard)
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiBodyDto(PostCreateDto)
	@ApiCreatedSuccessResponse(PostCreatedResponseDto)
	@ApiValidationErrorResponse({
		content: ['content must be a string'],
	})
	@ResponseEnvelope('Post created successfully')
	async writePost(
		@Body() dto: PostCreateDto,
		@CurrentUser() user: JwtAccessPayload,
	): Promise<PostCreatedResponseDto> {
		return await this.postService.create(dto, user.sub);
	}

	@UseGuards(JWTAccessGuard)
	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiParam({
		name: 'id',
		description: 'The id of the post to delete',
		type: String,
		format: 'uuid',
	})
	@ApiNoContentSuccessResponse({ description: 'Post deleted successfully' })
	async deletePost(
		@Param('id') id: string,
		@CurrentUser() user: JwtAccessPayload,
	): Promise<void> {
		await this.postService.delete(id, user.sub);
	}
}

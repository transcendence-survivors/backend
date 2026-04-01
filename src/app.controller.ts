import {
	Controller,
	Get,
	Param,
	Post,
	Body,
	Put,
	Delete,
	Req,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { PostsService } from './post.service';
import { User as UserModel, Post as PostModel } from '@prisma-generated/client';
import { NotFoundException } from '@nestjs/common';
@Controller()
export class AppController {
	constructor(
		private readonly userService: UsersService,
		private readonly postService: PostsService,
	) {}

	@Get('post/:id')
	async getPostById(@Param('id') id: string): Promise<any> {
		try {
			const post: PostModel | null = await this.postService.post({
				id: id,
			});
			if (!post) {
				throw new Error('Post not found');
			}
			return post;
		} catch (e: any) {
			return { error: e.message };
		}
	}

	@Get('feed')
	async getPublishedPosts(): Promise<PostModel[]> {
		return this.postService.posts({
			where: { published: true },
		});
	}

	@Get('filtered-posts/:searchString')
	async getFilteredPosts(
		@Param('searchString')
		searchString: string,
	): Promise<PostModel[]> {
		return this.postService.posts({
			where: {
				OR: [
					{
						title: {
							contains: searchString,
						},
					},
					{
						content: {
							contains: searchString,
						},
					},
				],
			},
		});
	}

	@Post('post')
	async createDraft(
		@Body()
		postData: {
			title: string;
			content?: string;
			authorEmail: string;
		},
	): Promise<PostModel> {
		const { title, content, authorEmail } = postData;
		return this.postService.createPost({
			title,
			content,
			author: {
				connect: {
					email: authorEmail,
				},
			},
		});
	}

	@Post('user')
	async signupUser(
		@Body()
		userData: {
			name?: string;
			email: string;
		},
	): Promise<UserModel> {
		return this.userService.createUser(userData);
	}

	@Put('publish/:id')
	async publishPost(@Param('id') id: string): Promise<PostModel> {
		return this.postService.updatePost({
			where: { id: id },
			data: {
				published: true,
			},
		});
	}
	@Delete('post/:id')
	async deletePost(@Param('id') id: string, @Req() req: Request) {
		const post = await this.postService.post({ id: id });

		if (!post) throw new NotFoundException();
		// if (post.authorId !== req.user.id) throw new ForbiddenException();

		return this.postService.deletePost({ id: id });
	}
}

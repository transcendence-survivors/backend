import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../repositories/comment.repository';
import { CommentQueryDto } from '../dto/comment-query.dto';
import { CursorService } from '@/shared/services/cursor.service';

@Injectable()
export class CommentService {
	constructor(
		private readonly commentRepository: CommentRepository,
		private readonly cursor: CursorService,
	) {}

	create(
		userId: string,
		postId: string,
		content?: string,
		imageUrl?: string,
	) {
		return this.commentRepository.create(userId, postId, content, imageUrl);
	}

	async findCursor(postId: string, query: CommentQueryDto) {
		const commentaries = await this.commentRepository.cursor(postId, query);

		return this.cursor.create(commentaries, query.limit, (post) => post.id);
	}
}

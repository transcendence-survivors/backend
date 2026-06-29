import { Injectable } from '@nestjs/common';

export interface CursorPaginationMeta {
	hasNextPage: boolean;
	nextCursor: string | null;
}

export type CursorPaginationResult<T> = {
	data: T[];
	meta: CursorPaginationMeta;
};

@Injectable()
export class CursorService {
	create<T>(
		data: T[],
		limit: number,
		getCursor: (item: T) => string,
	): CursorPaginationResult<T> {
		const hasNextPage = data.length > limit;
		const sliced = hasNextPage ? data.slice(0, limit) : data;

		return {
			data: sliced,
			meta: {
				hasNextPage,
				nextCursor: hasNextPage
					? getCursor(sliced[sliced.length - 1])
					: null,
			},
		};
	}
}

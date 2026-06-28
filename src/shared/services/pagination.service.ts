import { Injectable } from '@nestjs/common';

export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
	itemsCount: number;
}

export interface CursorPaginationMeta {
	limit: number;
	total: number;
	hasNextPage: boolean;
	nextCursor: string | null;
	itemsCount: number;
}

export interface PaginationResult<T> {
	data: T[];
	meta: PaginationMeta;
}

export type CursorPaginationResult<T> = {
	data: T[];
	meta: CursorPaginationMeta;
};

@Injectable()
export class PaginationService {
	create<T>(
		data: T[],
		page: number,
		limit: number,
		total: number,
	): PaginationResult<T> {
		const totalPages = Math.ceil(total / limit);

		return {
			data,
			meta: {
				page,
				limit,
				total,
				totalPages,
				hasNextPage: page < totalPages,
				hasPrevPage: page > 1,
				itemsCount: data.length,
			},
		};
	}

	cursor<T>(
		data: T[],
		limit: number,
		total: number,
		getCursor: (item: T) => string,
	): CursorPaginationResult<T> {
		const hasNextPage = data.length > limit;
		const sliced = hasNextPage ? data.slice(0, limit) : data;

		return {
			data: sliced,
			meta: {
				limit,
				total,
				hasNextPage,
				nextCursor: hasNextPage
					? getCursor(sliced[sliced.length - 1])
					: null,
				itemsCount: sliced.length,
			},
		};
	}
}

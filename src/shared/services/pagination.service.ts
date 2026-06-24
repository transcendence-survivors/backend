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

export interface PaginationResult<T> {
	data: T[];
	meta: PaginationMeta;
}

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
}

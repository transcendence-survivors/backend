import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class CursorPaginationMetaDto {
	@ApiProperty({
		example: false,
		description: 'Indicates if there are more items to fetch',
		type: Boolean,
	})
	@Expose()
	hasNextPage!: boolean;

	@ApiProperty({
		nullable: true,
		type: String,
		example: 'next_cursor',
		description: 'The cursor for the next page of results',
	})
	@Expose()
	nextCursor!: string | null;
}

@Exclude()
export class CursorPaginationResultDto<T> {
	data!: T[];

	@ApiProperty({
		type: CursorPaginationMetaDto,
		description: 'Pagination metadata',
	})
	@Expose()
	@Type(() => CursorPaginationMetaDto)
	meta!: CursorPaginationMetaDto;
}

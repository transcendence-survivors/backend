import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class CursorPaginationMetaDto {
	@ApiProperty()
	@Expose()
	hasNextPage!: boolean;

	@ApiProperty({ nullable: true, type: String })
	@Expose()
	nextCursor!: string | null;
}

export class CursorPaginationResultDto<T> {
	data!: T[];

	@ApiProperty({ type: CursorPaginationMetaDto })
	@Expose()
	@Type(() => CursorPaginationMetaDto)
	meta!: CursorPaginationMetaDto;
}

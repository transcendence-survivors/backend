import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class CursorPaginationMetaDto {
	@ApiProperty()
	@Expose()
	hasNextPage!: boolean;

	@ApiProperty({ nullable: true, type: String })
	@Expose()
	nextCursor!: string | null;
}

@Exclude()
export class CursorPaginationResultDto<T> {
	data!: T[];

	@ApiProperty({ type: CursorPaginationMetaDto })
	@Expose()
	@Type(() => CursorPaginationMetaDto)
	meta!: CursorPaginationMetaDto;
}

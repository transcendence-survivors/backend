import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserListItemResponseDto {
	@ApiProperty()
	@Expose()
	id!: string;

	@ApiProperty()
	@Expose()
	username!: string;

	@ApiProperty()
	@Expose()
	displayName!: string;

	@ApiProperty({ nullable: true, type: String })
	@Expose()
	avatarUrl!: string | null;
}

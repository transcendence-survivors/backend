import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { RelationshipStatus } from '../../types/enums/relationship-status.enum';

@Exclude()
export class RelationshipStatusResponseDto {
	@ApiProperty({
		description: 'The unique identifier of the target user',
		example: 'usr_99887766',
	})
	@Expose()
	id!: string;

	@ApiProperty({
		description: 'The username of the target user',
		example: 'JohnDoe',
	})
	@Expose()
	username!: string;

	@ApiProperty({
		description: 'The display name of the target user',
		example: 'John Doe',
	})
	@Expose()
	displayName!: string;

	@ApiProperty({
		description:
			'The relationship status with the target user (block states take precedence)',
		enum: RelationshipStatus,
		example: RelationshipStatus.FRIENDS,
	})
	@Expose()
	status!: RelationshipStatus;
}

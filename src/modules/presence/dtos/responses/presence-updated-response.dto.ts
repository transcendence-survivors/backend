import { Exclude, Expose } from 'class-transformer';
import { PresenceStatusEnum } from '../../types/enums/presence-status.enum';

@Exclude()
export class PresenceUpdatedResponseDto {
	@Expose()
	id!: string;

	@Expose()
	status!: PresenceStatusEnum;
}

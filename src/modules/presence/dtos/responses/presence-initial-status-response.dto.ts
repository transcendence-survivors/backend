import { Exclude, Expose } from 'class-transformer';
import { PresenceStatusEnum } from '../../types/enums/presence-status.enum';

@Exclude()
export class PresenceInitialStatusResponseDto {
	@Expose()
	id!: string;

	@Expose()
	status!: PresenceStatusEnum;
}

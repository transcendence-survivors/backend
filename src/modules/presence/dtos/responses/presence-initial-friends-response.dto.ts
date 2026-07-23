import { Exclude, Expose, Type } from 'class-transformer';
import { PresenceInitialStatusResponseDto } from './presence-initial-status-response.dto';

@Exclude()
export class PresenceInitialFriendsResponseDto {
	@Expose()
	@Type(() => PresenceInitialStatusResponseDto)
	friends!: PresenceInitialStatusResponseDto[];
}

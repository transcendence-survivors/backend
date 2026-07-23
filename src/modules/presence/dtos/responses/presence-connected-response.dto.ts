import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PresenceConnectedResponseDto {
	@Expose()
	id!: string;

	@Expose()
	username!: string;

	@Expose()
	displayName!: string;

	@Expose()
	avatarUrl!: string | null;

	@Expose()
	status!: string;
}

import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PresenceCountResponseDto {
	@Expose()
	count!: number;
}

import { Injectable } from '@nestjs/common';
import { AuthUserResponseDto } from '../dtos/responses/auth-user-response.dto';
import { UserTokenData } from '@/contracts/types/user/user-token-data.type';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthMapper {
	toUserResponse(user: UserTokenData): AuthUserResponseDto {
		return plainToInstance(AuthUserResponseDto, user, {
			excludeExtraneousValues: true,
		});
	}
}

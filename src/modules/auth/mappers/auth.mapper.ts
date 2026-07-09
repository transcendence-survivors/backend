import { Injectable } from '@nestjs/common';
import { AuthUserResponseDto } from '../dtos/responses/auth-user-response.dto';
import { AuhtUserData } from '@/contracts/types/user/user-token-data.type';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthMapper {
	toUserResponse(user: AuhtUserData): AuthUserResponseDto {
		return plainToInstance(AuthUserResponseDto, user, {
			excludeExtraneousValues: true,
		});
	}
}

import { AuthUserResponseDto } from '../../dtos/responses/auth-user-response.dto';

export interface AuthSignUp {
	accessToken: string;
	refreshToken: string;
	user: AuthUserResponseDto;
}

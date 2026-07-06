import { AuthUserResponseDto } from '../../dtos/responses/auth-user-response.dto';

export interface AuthSignIn {
	accessToken: string;
	refreshToken: string;
	user: AuthUserResponseDto;
}

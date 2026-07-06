import { ApiErrorFrom } from '@/shared/decorators/api-error-response.decorator';
import { AuthLoginException } from '../exceptions/auth-login-exception.exceptions';
import { AuthRefreshException } from '../exceptions/auth-refresh-exception';

export const ApiAuthLoginResponse = () => ApiErrorFrom(AuthLoginException);

export const ApiAuthRefreshResponse = () => ApiErrorFrom(AuthRefreshException);

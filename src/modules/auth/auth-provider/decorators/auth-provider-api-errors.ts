import { ApiErrorFrom } from '@/shared/decorators/api-error-response.decorator';
import { AuthProviderCredentialsException } from '../exceptions/auth-provider-credentials.exception';

export const ApiAuthProviderCredentialsResponse = () =>
	ApiErrorFrom(AuthProviderCredentialsException);

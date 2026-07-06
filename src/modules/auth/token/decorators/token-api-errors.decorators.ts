import { ApiErrorFrom } from '@/shared/decorators/api-error-response.decorator';
import { TokenExpiredException } from '../exceptions/token-expired.exception';
import { TokenRevokedException } from '../exceptions/token-revoked.exception';
import { TokenNotFoundException } from '../exceptions/token-not-found.exception';

export const ApiTokenExpiredResponse = () =>
	ApiErrorFrom(TokenExpiredException);

export const ApiTokenRevokedResponse = () =>
	ApiErrorFrom(TokenRevokedException);

export const ApiTokenNotFoundResponse = () =>
	ApiErrorFrom(TokenNotFoundException);

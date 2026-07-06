import { UserNotFoundException } from '../exceptions/user.not-found.exception';
import {
	UserEmailConflictException,
	UserUsernameConflictException,
} from '../exceptions/user.conflict.exception';
import { ApiErrorFrom } from '@/shared/decorators/api-error-response.decorator';

export const ApiUserNotFoundResponse = () =>
	ApiErrorFrom(UserNotFoundException);
export const ApiUsernameConflictResponse = () =>
	ApiErrorFrom(UserUsernameConflictException);
export const ApiEmailConflictResponse = () =>
	ApiErrorFrom(UserEmailConflictException);

import { ApiErrorFrom } from '@/shared/decorators/api-error-response.decorator';
import {
	FriendDoesNotExistException,
	FriendRequestDoesNotExistException,
} from '../exceptions/friend-not-found.exception';
import {
	FriendAlreadyExistsException,
	FriendRequestAlreadySentException,
} from '../exceptions/friend-conflict.exception';
import {
	SelfFriendDeleteException,
	SelfFriendRequestDeleteException,
	SelfFriendRequestSentException,
} from '../exceptions/friend-bad.exception';
import {
	FriendshipBlockedByUserException,
	FriendshipBlockedByYouException,
} from '../exceptions/friend-forbidden.exception';
import { FriendRequestSelfAcceptException } from '../exceptions/friend-unprocessable.exception';

export const ApiSelfFriendRequestSentResponse = () =>
	ApiErrorFrom(SelfFriendRequestSentException);
export const ApiSelfFriendDeleteResponse = () =>
	ApiErrorFrom(SelfFriendDeleteException);
export const ApiSelfFriendRequestDeleteResponse = () =>
	ApiErrorFrom(SelfFriendRequestDeleteException);

export const ApiFriendAlreadyExistsResponse = () =>
	ApiErrorFrom(FriendAlreadyExistsException);
export const ApiFriendRequestAlreadySentResponse = () =>
	ApiErrorFrom(FriendRequestAlreadySentException);

export const ApiFriendshipBlockedByUserResponse = () =>
	ApiErrorFrom(FriendshipBlockedByUserException);
export const ApiFriendshipBlockedByYouResponse = () =>
	ApiErrorFrom(FriendshipBlockedByYouException);

export const ApiFriendNotFoundResponse = () =>
	ApiErrorFrom(FriendDoesNotExistException);
export const ApiFriendRequestNotFoundResponse = () =>
	ApiErrorFrom(FriendRequestDoesNotExistException);

export const ApiFriendRequestSelfAcceptResponse = () =>
	ApiErrorFrom(FriendRequestSelfAcceptException);

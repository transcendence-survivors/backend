import { ApiErrorFrom } from '@/shared/decorators/api-error-response.decorator';
import {
	SelfBlockBadException,
	SelfUnblockBadException,
} from './exceptions/block-bad.exception';
import { BlockConflictException } from './exceptions/block-conflict.exception';
import { BlockNotFoundException } from './exceptions/block-not-found.exceptions';

export const ApiSelfUnblockResponse = () =>
	ApiErrorFrom(SelfUnblockBadException);

export const ApiSelfBlockResponse = () => ApiErrorFrom(SelfBlockBadException);

export const ApiBlockConflictResponse = () =>
	ApiErrorFrom(BlockConflictException);

export const ApiBlockNotFoundResponse = () =>
	ApiErrorFrom(BlockNotFoundException);

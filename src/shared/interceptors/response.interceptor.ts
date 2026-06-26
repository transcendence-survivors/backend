import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
	ApiSuccess,
	ApiSuccessEnvelope,
} from '../interfaces/api-response.interface';

export type ResponseInput<T> = T | ApiSuccessEnvelope<T>;

const isApiSuccessEnvelope = <T>(
	value: unknown,
): value is ApiSuccessEnvelope<T> => {
	if (typeof value !== 'object' || value === null) {
		return false;
	}
	if (!('message' in value) && !('data' in value)) {
		return false;
	}
	return true;
};

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
	ResponseInput<T>,
	ApiSuccess<T>
> {
	intercept(
		_: ExecutionContext,
		next: CallHandler<ResponseInput<T>>,
	): Observable<ApiSuccess<T>> {
		return next.handle().pipe(
			map((response) => {
				if (isApiSuccessEnvelope<T>(response)) {
					return {
						status: 'success',
						message: response.message,
						data: response.data,
					};
				}

				return {
					status: 'success',
					data: response,
				};
			}),
		);
	}
}

import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type ResponseInput<T> =
	| T
	| {
			data: T;
			message?: string;
	  };

export interface SuccessResponse<T> {
	status: 'success';
	message?: string;
	data: T;
}

type ResponseWithMeta<T> = {
	data: T;
	message?: string;
};

const isResponseWithMeta = <T>(
	value: unknown,
): value is ResponseWithMeta<T> => {
	return typeof value === 'object' && value !== null && 'data' in value;
};

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
	ResponseInput<T>,
	SuccessResponse<T>
> {
	intercept(
		context: ExecutionContext,
		next: CallHandler<ResponseInput<T>>,
	): Observable<SuccessResponse<T>> {
		return next.handle().pipe(
			map((response) => {
				if (isResponseWithMeta<T>(response)) {
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

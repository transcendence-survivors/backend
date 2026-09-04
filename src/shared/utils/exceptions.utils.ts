import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionResponse } from '../types/exception-response.type';
import { AppHttpException } from '../filters/app.http.exception';
import { ApiError, WsResponse } from '../types/response.type';

export const handleWs = async <T>(
	fn: () => Promise<T> | T,
): Promise<WsResponse<T>> => {
	try {
		const data = await fn();
		return { status: 'success', data };
	} catch (exception) {
		return mapExceptionToErrorBody(exception);
	}
};

export const mapExceptionToErrorBody = (exception: unknown): ApiError => {
	if (!isHttpException(exception)) {
		console.error('Unhandled exception:', exception);
		return {
			status: 'error',
			message: 'Internal server error',
			code: HttpStatus.INTERNAL_SERVER_ERROR,
			errors: null,
		};
	}

	const res = exception.getResponse() as ExceptionResponse;
	const code = exception.getStatus();

	return {
		status: 'error',
		message: extractMessage(res),
		messageKey: extractMessageKey(exception),
		code,
		errors: extractErrors(res),
	};
};

function extractMessage(response: ExceptionResponse): string {
	if (typeof response === 'string') return response;
	if (isExceptionResponseObject(response))
		return response.message ?? 'An error occurred';
	return 'An error occurred';
}

const extractErrors = (
	response: ExceptionResponse,
): Record<string, unknown> | null => {
	if (isExceptionResponseObject(response)) return response.errors ?? null;
	return null;
};

const extractMessageKey = (exception: unknown): string | undefined => {
	if (isCustomHttpException(exception)) return exception.messageKey;
	return undefined;
};

const isHttpException = (exception: unknown): exception is HttpException => {
	return exception instanceof HttpException;
};

const isCustomHttpException = (
	exception: unknown,
): exception is AppHttpException => {
	return exception instanceof AppHttpException;
};

const isExceptionResponseObject = (
	value: unknown,
): value is Exclude<ExceptionResponse, string> => {
	return typeof value === 'object' && value !== null;
};

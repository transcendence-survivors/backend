import { HttpStatus } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ExceptionResponse } from '../types/exception-response.type';
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
	if (isApiError(exception)) return exception;

	if (exception instanceof WsException) {
		const error = exception.getError();
		if (typeof error === 'object' && error !== null) {
			return error as ApiError;
		}
		return {
			status: 'error',
			message: typeof error === 'string' ? error : 'unknown error',
			code: 0,
			errors: null,
		};
	}

	if (!isHttpExceptionLike(exception)) {
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
	if (
		typeof exception === 'object' &&
		exception !== null &&
		'messageKey' in exception &&
		typeof (exception as { messageKey?: unknown }).messageKey === 'string'
	) {
		return (exception as { messageKey: string }).messageKey;
	}

	if (isHttpExceptionLike(exception)) {
		const res = exception.getResponse();
		if (isExceptionResponseObject(res) && 'messageKey' in res) {
			return String((res as Record<string, unknown>).messageKey);
		}
	}

	return undefined;
};

const isHttpExceptionLike = (
	exception: unknown,
): exception is { getResponse: () => unknown; getStatus: () => number } => {
	return (
		typeof exception === 'object' &&
		exception !== null &&
		'getResponse' in exception &&
		'getStatus' in exception &&
		typeof (exception as Record<string, unknown>).getResponse ===
			'function' &&
		typeof (exception as Record<string, unknown>).getStatus === 'function'
	);
};

const isExceptionResponseObject = (
	value: unknown,
): value is Exclude<ExceptionResponse, string> => {
	return typeof value === 'object' && value !== null;
};

const isApiError = (obj: unknown): obj is ApiError => {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		'status' in obj &&
		'code' in obj &&
		'message' in obj
	);
};

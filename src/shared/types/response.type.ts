export type ApiSuccessEnvelope<T> = {
	data: T;
	message?: string;
};

export type ApiSuccess<T> = ApiSuccessEnvelope<T> & {
	status: 'success';
};

export type ApiError = {
	status: 'error';
	message: string;
	messageKey?: string;
	code: number;
	errors: Record<string, unknown> | null;
};

export type WsSuccessBody<T = unknown> = {
	status: 'success';
	data: T;
};

export type WsResponse<T = unknown> = WsSuccessBody<T> | ApiError;

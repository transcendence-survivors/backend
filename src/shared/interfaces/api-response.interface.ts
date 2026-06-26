type ApiSuccessEnvelope<T> = {
	data: T;
	message?: string;
};

type ApiSuccess<T> = ApiSuccessEnvelope<T> & {
	status: 'success';
};

export type { ApiSuccessEnvelope, ApiSuccess };

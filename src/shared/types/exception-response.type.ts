export type ExceptionString = string;

export type ExceptionObject = {
	message?: string;
	errors?: Record<string, unknown>;
};

export type ExceptionResponse = ExceptionString | ExceptionObject;

export type ApiResponse<T> = {
	data: T;
	message?: string;
};

export abstract class BaseController {
	protected ok<T>(data: T, message?: string): ApiResponse<T> {
		return { data, message };
	}
}

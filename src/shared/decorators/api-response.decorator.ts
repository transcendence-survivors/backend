import { ApiSuccessEnvelope } from '../types/response.type';

export const ResponseEnvelope = (message?: string): MethodDecorator => {
	return (_target, _propertyKey, descriptor: PropertyDescriptor) => {
		const original = descriptor.value as (
			...args: unknown[]
		) => Promise<unknown>;

		descriptor.value = async function (
			this: unknown,
			...args: unknown[]
		): Promise<ApiSuccessEnvelope<unknown>> {
			const data: unknown = await original.apply(this, args);
			return { data, message };
		};

		return descriptor;
	};
};

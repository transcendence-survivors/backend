import { Transform } from 'class-transformer';

const Trim = () => {
	return Transform(({ value }: { value: unknown }): unknown =>
		typeof value === 'string' ? value.trim() : value,
	);
};

const TrimLowercase = () => {
	return Transform(({ value }: { value: unknown }): unknown =>
		typeof value === 'string' ? value.trim().toLowerCase() : value,
	);
};

export { Trim, TrimLowercase };

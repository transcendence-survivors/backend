export const msFromNow = (ms: number): Date => {
	return new Date(Date.now() + ms);
};

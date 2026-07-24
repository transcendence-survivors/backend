import { StorageBucket } from './types/storage-bucket';

const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const VIDEO_MIMES = ['video/mp4', 'video/webm'] as const;

const ALLOWED_CONTENT_TYPES: Record<StorageBucket, string[]> = {
	avatar: [...IMAGE_MIMES],
	post: [...IMAGE_MIMES, ...VIDEO_MIMES],
	chat: [...IMAGE_MIMES, ...VIDEO_MIMES],
} as const;

export { ALLOWED_CONTENT_TYPES, IMAGE_MIMES, VIDEO_MIMES };

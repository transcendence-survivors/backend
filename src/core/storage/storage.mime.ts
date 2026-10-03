import { StorageBucket } from './types/storage-bucket';

export const BUCKET_MAX_SIZE_BYTES: Record<StorageBucket, number> = {
	avatar: 5 * 1024 * 1024,
	post: 50 * 1024 * 1024,
	chat: 100 * 1024 * 1024,
};

const MIME_TO_EXTENSION: Record<string, string> = {
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
	'image/avif': 'avif',
	'image/gif': 'gif',
	'image/svg+xml': 'svg',
	'image/bmp': 'bmp',
	'image/x-icon': 'ico',
	'image/vnd.microsoft.icon': 'ico',
	'image/tiff': 'tiff',
	'image/heic': 'heic',
	'image/heif': 'heif',

	'video/mp4': 'mp4',
	'video/webm': 'webm',
	'video/ogg': 'ogv',
	'video/quicktime': 'mov',
	'video/x-msvideo': 'avi',
	'video/x-matroska': 'mkv',
	'video/3gpp': '3gp',
	'video/3gpp2': '3g2',
	'video/mpeg': 'mpeg',
	'video/mp2t': 'ts',
};

const IMAGE_MIMES = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/avif',
	'image/gif',
	'image/svg+xml',
	'image/bmp',
	'image/x-icon',
	'image/vnd.microsoft.icon',
	'image/tiff',
	'image/heic',
	'image/heif',
] as const;

const VIDEO_MIMES = [
	'video/mp4',
	'video/webm',
	'video/ogg',
	'video/quicktime',
	'video/x-msvideo',
	'video/x-matroska',
	'video/3gpp',
	'video/3gpp2',
	'video/mpeg',
	'video/mp2t',
] as const;

const ALLOWED_CONTENT_TYPES: Record<StorageBucket, string[]> = {
	avatar: [...IMAGE_MIMES],
	post: [...IMAGE_MIMES],
	chat: [...IMAGE_MIMES, ...VIDEO_MIMES],
} as const;

export { ALLOWED_CONTENT_TYPES, IMAGE_MIMES, VIDEO_MIMES, MIME_TO_EXTENSION };

import { readFileSync } from 'fs';
import { join } from 'path';
import type { Provider } from '@nestjs/common';
import type {
	TranslationLoaderRecord,
	TranslationSchema,
} from '../types/translation.types';

export const TRANSLATION_LOADERS = 'TRANSLATION_LOADERS';

const cwd = process.cwd();

const loadJson = <T>(file: string): T => {
	return JSON.parse(
		readFileSync(join(cwd, 'dist/core/email/locales', file), 'utf-8'),
	) as T;
};

export const loaders = {
	EN: () => loadJson<TranslationSchema>('en.json'),
	FR: () => loadJson<TranslationSchema>('fr.json'),
	DE: () => loadJson<TranslationSchema>('de.json'),
	ES: () => loadJson<TranslationSchema>('en.json'),
	IT: () => loadJson<TranslationSchema>('en.json'),
} as const satisfies TranslationLoaderRecord;

export const TranslationProvider: Provider = {
	provide: TRANSLATION_LOADERS,
	useValue: loaders,
};

import { LocalePreference } from '@prisma-generated/enums';

export type TranslationSchema = typeof import('../locales/en.json');

export type TranslationLoaderRecord = Record<
	LocalePreference,
	() => TranslationSchema
>;

export type Section = keyof TranslationSchema;
export type SectionKeys<S extends Section> = keyof TranslationSchema[S] &
	string;

export type ScopedT<S extends keyof TranslationSchema> = (
	key: keyof TranslationSchema[S] & string,
	params?: Record<string, string>,
) => string;

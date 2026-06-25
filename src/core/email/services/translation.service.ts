import { Inject, Injectable } from '@nestjs/common';
import type {
	TranslationLoaderRecord,
	ScopedT,
	TranslationSchema,
} from '../types/translation.types';
import { TRANSLATION_LOADERS } from '../providers/translation.provider';
import type { LocalePreference } from '@prisma-generated/enums';

@Injectable()
export class TranslationService {
	private cache = new Map<LocalePreference, TranslationSchema>();
	private readonly fallback: LocalePreference = 'EN';

	constructor(
		@Inject(TRANSLATION_LOADERS)
		private readonly loaders: TranslationLoaderRecord,
	) {}

	private load(locale: LocalePreference): TranslationSchema {
		if (this.cache.has(locale)) {
			return this.cache.get(locale)!;
		}

		try {
			const translations =
				this.loaders[locale]?.() ?? this.loaders[this.fallback]();

			this.cache.set(locale, translations);
			return translations;
		} catch {
			throw new Error(`Missing translations for locale: ${locale}`);
		}
	}

	scope<S extends keyof TranslationSchema>(
		locale: LocalePreference,
		section: S,
	): ScopedT<S> {
		const dict = this.load(locale);
		const base = dict[section] as Record<string, string>;

		return (key: string, params?: Record<string, string>) => {
			const value = base[key];
			if (typeof value !== 'string') {
				throw new Error(
					`Missing translation: ${String(section)}.${key}`,
				);
			}
			if (!params) return value;
			return Object.entries(params).reduce(
				(acc, [k, v]) => acc.replaceAll(`{{${k}}}`, v),
				value,
			);
		};
	}
}

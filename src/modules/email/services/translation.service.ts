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

	constructor(
		@Inject(TRANSLATION_LOADERS)
		private readonly loaders: TranslationLoaderRecord,
	) {}

	private load(locale: LocalePreference): TranslationSchema {
		if (this.cache.has(locale)) {
			return this.cache.get(locale)!;
		}

		const translations = this.loaders[locale]();
		this.cache.set(locale, translations);
		return translations;
	}

	scope<S extends keyof TranslationSchema>(
		locale: LocalePreference,
		section: S,
	): ScopedT<S> {
		const dict = this.load(locale);
		const base: Record<string, unknown> = dict[section];

		return (key: string, params?: Record<string, string>) => {
			const value = base[key];
			if (typeof value !== 'string') {
				throw new Error(
					`Missing translation: ${String(section)}.${key}`,
				);
			}

			let result = value;
			if (params) {
				for (const [k, v] of Object.entries(params)) {
					result = result.replaceAll(`{{${k}}}`, v);
				}
			}
			return result;
		};
	}
}

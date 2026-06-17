import { Injectable } from '@nestjs/common';
import { InjectEnv } from '@/modules/env/injects/env.inject';
import { type Env } from '@/modules/env/providers/env.provider';
import { MailerService } from '@nestjs-modules/mailer';
import { TranslationService } from './translation.service';
import { type LocalePreference } from '@prisma-generated/client';
import { type SentMessageInfo } from 'nodemailer';

type Template = 'reset-password' | 'verify-email' | 'welcome';

interface EmailOptions {
	to: string;
	subject: string;
	template: Template;
	locale: LocalePreference;
	context?: Record<string, unknown>;
}

@Injectable()
export class EmailService {
	constructor(
		private readonly mailer: MailerService,
		private readonly t: TranslationService,
		@InjectEnv() private readonly env: Env,
	) {}

	private send({ to, subject, template, locale, context }: EmailOptions) {
		const t = this.t.scope(locale, 'footer');
		return this.mailer.sendMail({
			to,
			subject,
			template,
			context: {
				...context,
				year: new Date().getFullYear(),
				rights_reserved: t('rights_reserved'),
				APP_NAME: 'Transcendence Survivor',
			},
		});
	}

	sendResetPassword(
		to: string,
		resetToken: string,
		locale: LocalePreference,
	): Promise<SentMessageInfo> {
		const url = `${this.env.frontEndUrl}/reset-password?token=${resetToken}`;
		const t = this.t.scope(locale, 'resetPassword');
		return this.send({
			to,
			subject: t('subject'),
			template: 'reset-password',
			locale,
			context: {
				url,
				headerSub: t('headerSub'),
				title: t('title'),
				message: t('message'),
				button: t('button'),
				expires: t('expires'),
				ignoreWarning: t('ignoreWarning'),
				troubleClicking: t('troubleClicking'),
				automatedEmailText: t('automatedEmailText'),
				supportText: t('supportText'),
				supportUrl: `${this.env.frontEndUrl}/support`,
			},
		});
	}

	sendWelcomeEmail(
		user: {
			firstName: string;
			lastName: string;
			email: string;
			name: string;
		},
		locale: LocalePreference,
	): Promise<SentMessageInfo> {
		const t = this.t.scope(locale, 'welcome');
		return this.send({
			to: user.email,
			subject: t('subject'),
			template: 'welcome',
			locale,
			context: {
				title: t('title'),
				greeting: t('greeting', {
					firstName: user.firstName,
					lastName: user.lastName,
				}),
				intro: t('intro'),
				account_confirmed: t('account_confirmed', {
					username: user.name,
					email: user.email,
				}),
				next_title: t('next_title'),
				step_1: t('step_1'),
				step_2: t('step_2'),
				step_3: t('step_3'),
				footer_text: t('footer_text'),
			},
		});
	}
}

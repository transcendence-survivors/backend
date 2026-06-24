import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { EmailService } from './services/email.service';
import { ENV } from '../../core/config/env/providers/env.provider';
import { type Env } from '../../core/config/env/providers/env.provider';
import { join } from 'path';
import { TranslationService } from './services/translation.service';
import { EnvModule } from '../../core/config/env/env.module';
import { TranslationProvider } from './providers/translation.provider';

@Module({
	imports: [
		EnvModule,
		MailerModule.forRootAsync({
			inject: [ENV],
			useFactory: (env: Env) => {
				const isProduction = env.nodeEnv === 'production';
				const baseDir = join(process.cwd(), 'dist/core/email');

				return {
					transport: {
						host: env.smtp.host,
						port: env.smtp.port,
						secure: isProduction,
						auth: {
							user: env.smtp.user,
							pass: env.smtp.pass,
						},
					},
					defaults: {
						from: `"${env.smtp.nameFrom}" <${env.smtp.emailFrom}>`,
					},
					template: {
						dir: join(baseDir, 'templates'),
						adapter: new HandlebarsAdapter(),
						options: {
							strict: true,
						},
					},
				};
			},
		}),
	],
	providers: [EmailService, TranslationService, TranslationProvider],
	exports: [EmailService],
})
export class EmailModule {}

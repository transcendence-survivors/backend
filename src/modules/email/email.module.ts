import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { EmailService } from './services/email.service';
import { ENV, EnvProvider } from '../env/providers/env.provider';
import { type Env } from '../env/providers/env.provider';
import { join } from 'path';

@Module({
	imports: [
		MailerModule.forRootAsync({
			inject: [ENV],
			useFactory: (env: Env) => ({
				transport: {
					host: env.smtp.host,
					port: env.smtp.port,
					secure: env.nodeEnv === 'production',
					auth: {
						user: env.smtp.user,
						pass: env.smtp.pass,
					},
				},
				defaults: {
					from: `"${env.smtp.nameFrom}" <${env.smtp.emailFrom}>`,
				},
				template: {
					dir: join(process.cwd(), 'templates'),
					adapter: new HandlebarsAdapter(),
					options: {
						strict: true,
					},
				},
			}),
		}),
	],
	providers: [EmailService, EnvProvider],
	exports: [EmailService],
})
export class EmailModule {}

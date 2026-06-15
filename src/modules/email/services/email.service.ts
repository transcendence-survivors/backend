import { Injectable } from '@nestjs/common';
import { InjectEnv } from '@/modules/env/injects/env.inject';
import { type Env } from '@/modules/env/providers/env.provider';
import { MailerService } from '@nestjs-modules/mailer';

type Template = 'reset-password' | 'verify-email' | 'welcome';

interface EmailOptions {
	to: string;
	subject: string;
	html?: string;
	template?: Template;
}

@Injectable()
export class EmailService {
	constructor(
		private readonly mailer: MailerService,
		@InjectEnv() private readonly env: Env,
	) {}

	send({ to, subject, html, template }: EmailOptions) {
		return this.mailer.sendMail({
			to,
			subject,
			html,
			template,
		});
	}

	sendResetPassword(to: string, resetToken: string) {
		const url = `${this.env.frontEndUrl}/reset-password?token=${resetToken}`;
		return this.send({
			to,
			subject: 'Password Reset Request',
			html: `
                <h2>Password Reset</h2>
                <p>Click below to reset your password:</p>
                <a href="${url}">Reset Password</a>
                <p>This link expires in 15 minutes.</p>
            `,
		});
	}
}

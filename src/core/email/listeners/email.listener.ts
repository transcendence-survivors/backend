import {
	APP_EVENTS,
	PasswordResetRequestedEvent,
	UserCreatedEvent,
} from '@/contracts/events/internal';
import { EmailService } from '../services/email.service';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { UserDeletedEvent } from '@/contracts/events/internal/user/user-deleted.event';
import { PasswordChangedEvent } from '@/contracts/events/internal/password/password-change.event';

@Injectable()
export class EMailListener {
	constructor(private readonly service: EmailService) {}

	@OnEvent(APP_EVENTS.USER_CREATED, { async: true })
	async handleUserCreated(event: UserCreatedEvent) {
		await this.service.sendWelcomeEmail(
			{
				firstName: event.firstName,
				lastName: event.lastName,
				email: event.email,
				username: event.username,
			},
			event.locale,
		);
	}

	@OnEvent(APP_EVENTS.PASSWORD_RESET_REQUESTED, { async: true })
	async handlePasswordReset(event: PasswordResetRequestedEvent) {
		await this.service.sendResetPassword(
			event.email,
			event.token,
			event.locale,
		);
	}

	@OnEvent(APP_EVENTS.PASSWORD_CHANGED, { async: true })
	async handlePasswordChanged(event: PasswordChangedEvent) {
		await this.service.sendPasswordChanged(
			event.email,
			event.username,
			event.locale,
		);
	}

	@OnEvent(APP_EVENTS.USER_DELETED, { async: true })
	async handleUserDeleted(event: UserDeletedEvent) {
		await this.service.sendAccountDelete(
			event.email,
			event.username,
			event.locale,
		);
	}
}

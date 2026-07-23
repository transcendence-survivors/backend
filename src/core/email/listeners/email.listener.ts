import {
	APP_EVENTS,
	PasswordResetRequestedEvent,
	UserCreatedEvent,
} from '@/contracts/events/internal';
import { EmailService } from '../services/email.service';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EMailListener {
	constructor(private readonly service: EmailService) {}

	@OnEvent(APP_EVENTS.USER_CREATED)
	async handleUserCreated(event: UserCreatedEvent) {
		await this.service.sendWelcomeEmail(
			{
				firstName: event.firstName,
				lastName: event.lastName,
				email: event.email,
				name: event.username,
			},
			event.locale,
		);
	}

	@OnEvent(APP_EVENTS.PASSWORD_RESET_REQUESTED)
	async handlePasswordReset(event: PasswordResetRequestedEvent) {
		await this.service.sendResetPassword(
			event.email,
			event.token,
			event.locale,
		);
	}
}

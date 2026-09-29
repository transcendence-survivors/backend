import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { mapExceptionToErrorBody } from '../utils/exceptions.utils';

type AckCallback = (response: unknown) => void;

@Catch()
export class WsExceptionsFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost): void {
		const errorResponse = mapExceptionToErrorBody(exception);
		const args = host.getArgs<unknown[]>();

		let ack: AckCallback | null = null;

		for (const arg of args) {
			if (typeof arg === 'function') {
				ack = arg as AckCallback;
				break;
			}
			if (Array.isArray(arg)) {
				const foundFn = arg.find(
					(item): item is AckCallback => typeof item === 'function',
				);
				if (foundFn) {
					ack = foundFn;
					break;
				}
			}
		}
		if (ack) {
			ack(errorResponse);
			return;
		}
	}
}

import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ResponseEnvelope } from './decorators/api-response.decorator';

@Controller('health')
export class HealthController {
	constructor() {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ResponseEnvelope('Health Check')
	healthCheck() {
		return { status: 'ok' };
	}
}

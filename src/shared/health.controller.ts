import { Controller, Get, HttpCode } from '@nestjs/common';
import { ResponseEnvelope } from './decorators/api-response.decorator';

@Controller('health')
export class HealthController {
	constructor() {}

	@Get()
	@HttpCode(200)
	@ResponseEnvelope('Health Check')
	healthCheck() {
		return { status: 'ok' };
	}
}

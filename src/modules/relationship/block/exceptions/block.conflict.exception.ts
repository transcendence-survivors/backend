import { AppHttpException } from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class BlockConflictException extends AppHttpException {
	constructor() {
		super('Block already exists', 'block_conflict', HttpStatus.CONFLICT);
	}
}

export { BlockConflictException };

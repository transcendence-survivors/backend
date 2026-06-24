import { AppHttpException } from '@/shared/filters/app.http.exception';

class BlockNotFoundException extends AppHttpException {
	constructor() {
		super('Block not found', 'block.not.found', 404);
	}
}

export { BlockNotFoundException };

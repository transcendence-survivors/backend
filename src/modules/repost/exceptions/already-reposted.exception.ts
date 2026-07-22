import { AppHttpException } from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class AlreadyRepostedException extends AppHttpException {
	constructor() {
		super('Post already reposted', 'already_reposted', HttpStatus.CONFLICT);
	}
}

export { AlreadyRepostedException };

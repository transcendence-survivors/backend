import { AppHttpException } from '@/shared/filters/app.http.exception';
import { HttpStatus } from '@nestjs/common';

class FindParamException extends AppHttpException {
	constructor() {
		super(
			'At least one parameter must be provided',
			'user_find_param_required',
			HttpStatus.BAD_REQUEST,
		);
	}
}

export default FindParamException;

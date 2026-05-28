import { IsOptional } from 'class-validator';
import { IsDisplayName, IsLastName } from '../user.fields';

class UpdateUserDto {
	@IsLastName()
	@IsOptional()
	lastName?: string;

	@IsDisplayName()
	@IsOptional()
	displayName?: string;
}

export default UpdateUserDto;

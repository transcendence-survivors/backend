import { IsEmail, IsUsername } from '../user.fields';
import { IsOptional } from 'class-validator';

class CheckUserDto {
	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsUsername()
	username?: string;
}

export default CheckUserDto;

import CreateUserDto from '@/modules/user/dto/user-create.dto';
import { IsPassword } from '@/modules/user/user.decorators';

class SignUpDto extends CreateUserDto {
	@IsPassword()
	public readonly password!: string;
}

export default SignUpDto;

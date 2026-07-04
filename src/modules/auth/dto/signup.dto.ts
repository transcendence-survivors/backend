import UserCreateDto from '@/modules/user/dto/request/user-create.dto';
import { IsPassword } from '@/modules/user/user.decorators';

class SignUpDto extends UserCreateDto {
	@IsPassword()
	public readonly password!: string;
}

export default SignUpDto;

import { TrimLowercase } from '@/shared/decorators/trim-dto.decorators';
import { applyDecorators } from '@nestjs/common';
import { MaxLength, IsEmail as IsEmailValidator } from 'class-validator';

export const IsEmail = () => {
	return applyDecorators(IsEmailValidator(), MaxLength(254), TrimLowercase());
};

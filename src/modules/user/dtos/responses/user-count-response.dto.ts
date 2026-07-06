import { CountResponseDto } from '@/shared/dto/count-result.dto';
import { Exclude } from 'class-transformer';

@Exclude()
export class UserCountResponseDto extends CountResponseDto {}

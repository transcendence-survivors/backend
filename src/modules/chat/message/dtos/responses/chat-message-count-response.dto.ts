import { CountResponseDto } from '@/shared/dto/count-result.dto';
import { Exclude } from 'class-transformer';

@Exclude()
export class ChatMessageCountResponseDto extends CountResponseDto {}

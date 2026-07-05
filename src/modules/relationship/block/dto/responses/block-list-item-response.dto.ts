import { UserListItemResponseDto } from '@/modules/user/dto/response/user-list-item-response.dto';
import { Exclude } from 'class-transformer';

@Exclude()
export class BlockListItemResponseDto extends UserListItemResponseDto {}

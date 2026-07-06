import { UserListItemResponseDto } from '@/modules/user/dtos/responses/user-list-item-response.dto';
import { Exclude } from 'class-transformer';

@Exclude()
export class BlockListItemResponseDto extends UserListItemResponseDto {}

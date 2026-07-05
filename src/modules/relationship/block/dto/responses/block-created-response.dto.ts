import { Exclude } from 'class-transformer';
import { BlockListItemResponseDto } from './block-list-item-response.dto';

@Exclude()
export class BlockCreatedResponseDto extends BlockListItemResponseDto {}

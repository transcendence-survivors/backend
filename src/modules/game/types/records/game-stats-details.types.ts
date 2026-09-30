import { UserListItem } from '@/modules/user/user.public-api';
import {
	GamePlayerStats,
	GamePlayerWeaponStats,
	GameStats,
} from '@prisma-generated/browser';

export type GamePlayerWeaponStatsDetails = Pick<
	GamePlayerWeaponStats,
	'id' | 'kind' | 'level'
>;

export type GamePlayerStatsDetails = Pick<
	GamePlayerStats,
	| 'id'
	| 'maxHealth'
	| 'attackSpeed'
	| 'moveSpeed'
	| 'attackDamage'
	| 'armor'
	| 'luck'
	| 'killAmount'
	| 'lifesteal'
	| 'range'
	| 'size'
	| 'duration'
	| 'quantity'
	| 'penetration'
> & {
	weapons: GamePlayerWeaponStatsDetails[];
	user: UserListItem | null;
};

export type GameStatsDetails = Pick<
	GameStats,
	'id' | 'survivalTime' | 'totalKills' | 'createdAt'
> & {
	players: GamePlayerStatsDetails[];
};

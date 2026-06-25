import { faker } from '@faker-js/faker';
import { UserGender, LocalePreference } from '@prisma-generated/client';

export const fake = {
	string: (v: unknown): string => String(v),

	name: {
		first: (): string => faker.person.firstName(),
		last: (): string => faker.person.lastName(),
		full: (): string => faker.person.fullName(),
	},
	internet: {
		email: (opts?: { firstName?: string; lastName?: string }): string =>
			faker.internet.email(opts),

		url: (): string => faker.internet.url(),
	},

	location: {
		city: (): string => faker.location.city(),
		country: (): string => faker.location.country(),
	},

	date: {
		birthDate: (): Date =>
			faker.date.birthdate({
				mode: 'age',
				min: 13,
				max: 80,
			}),
	},

	enum: {
		gender: (): UserGender =>
			faker.helpers.arrayElement(Object.values(UserGender)),

		locale: (): LocalePreference =>
			faker.helpers.arrayElement(Object.values(LocalePreference)),
	},

	text: {
		bio: (): string =>
			faker.helpers.maybe(() => faker.lorem.sentence(), {
				probability: 0.7,
			}) ?? '',
	},

	image: {
		avatar: (): string =>
			`https://i.pravatar.cc/150?img=${faker.number.int({
				min: 1,
				max: 70,
			})}`,

		cover: (): string =>
			`https://picsum.photos/seed/${faker.string.uuid()}/800/300`,
	},

	username: (): string => {
		const first = faker.person.firstName();
		const last = faker.person.lastName();

		return `${first}_${last}_${faker.number.int({
			min: 1000,
			max: 999999,
		})}`
			.toLowerCase()
			.replace(/[^a-z0-9_]/g, '');
	},

	stats: {
		postCount: (): number => faker.number.int({ min: 0, max: 1000 }),
		followerCount: (): number => faker.number.int({ min: 0, max: 10000 }),
		followingCount: (): number => faker.number.int({ min: 0, max: 10000 }),
		likesGiven: (): number => faker.number.int({ min: 0, max: 5000 }),
		likesReceived: (): number => faker.number.int({ min: 0, max: 5000 }),
	},
};

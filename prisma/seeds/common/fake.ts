import { faker } from '@faker-js/faker';
import {
	UserGender,
	LocalePreference,
	ChatMessageType,
	ChatRoomType,
} from '@prisma-generated/client';

export const fake = {
	string: (v: unknown): string => String(v),
	boolean: (probability = 0.5): boolean =>
		faker.datatype.boolean({ probability }),

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

		pastRange: (fromDaysAgo: number, toDaysAgo = 0): Date => {
			const now = Date.now();
			const from = now - fromDaysAgo * 86_400_000;
			const to = now - toDaysAgo * 86_400_000;
			return new Date(faker.number.int({ min: from, max: to }));
		},
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

	chat: {
		roomType: (): ChatRoomType =>
			faker.helpers.arrayElement(Object.values(ChatRoomType)),

		roomName: (): string =>
			faker.helpers.arrayElement([
				`Project ${faker.company.name()}`,
				`Hangout Spot`,
				`Weekend Plans`,
				`Dev Team`,
				`Random Lounge`,
			]),

		messageText: (): string => {
			const format = faker.helpers.weightedArrayElement([
				{ weight: 35, value: 'short' },
				{ weight: 35, value: 'medium' },
				{ weight: 15, value: 'long' },
				{ weight: 8, value: 'list' },
				{ weight: 4, value: 'code' },
				{ weight: 3, value: 'link' },
			]);

			switch (format) {
				case 'short':
					return faker.helpers.arrayElement([
						'Yup!',
						'Sounds good 👍',
						'Makes sense',
						'On it!',
						'Haha nice! 😂',
						'Wait really?',
						'Brb',
						'LGTM 🚀',
						'Sure, let us do that.',
						'Thanks!',
					]);

				case 'medium':
					return faker.lorem.sentences({ min: 1, max: 3 });

				case 'long':
					return faker.lorem.paragraphs({ min: 1, max: 3 }, '\n\n');

				case 'list': {
					const count = faker.number.int({ min: 3, max: 6 });
					const isNumbered = faker.datatype.boolean({
						probability: 0.5,
					});

					const items = Array.from({ length: count }, (_, i) => {
						const prefix = isNumbered ? `${i + 1}. ` : '- ';
						return `${prefix}${faker.lorem.sentence()}`;
					});

					const intro = faker.helpers.arrayElement([
						'Here is what we need to get done:',
						'A few quick points:',
						'Summary of the meeting:',
						'Action items:',
					]);

					return `${intro}\n${items.join('\n')}`;
				}

				case 'code': {
					const codeSnippets = [
						'const data = await prisma.user.findMany();\nconsole.log(data);',
						'docker compose up -d --build',
						'git checkout -b feature/chat-seed\ngit push origin feature/chat-seed',
						'function calculateTotal(items) {\n  return items.reduce((acc, item) => acc + item.price, 0);\n}',
					];
					return `\`\`\`ts\n${faker.helpers.arrayElement(codeSnippets)}\n\`\`\``;
				}

				case 'link':
					return `${faker.lorem.sentence()} Check this out: ${faker.internet.url()}`;

				default:
					return faker.lorem.sentence();
			}
		},

		systemType: (): ChatMessageType =>
			faker.helpers.arrayElement([
				ChatMessageType.JOINED,
				ChatMessageType.LEFT,
				ChatMessageType.ROLE_UPDATED,
				ChatMessageType.ROOM_RENAMED,
			]),

		attachmentUrls: (): string[] =>
			faker.helpers.maybe(() => [faker.image.url()], {
				probability: 0.15,
			}) ?? [],
	},
};

import {
	type PrismaClient,
	AuthProviderType,
	User,
} from '@prisma-generated/client';
import bcrypt from 'bcrypt';
import { fake } from './common/fake';

const TOTAL_USERS = 50000;
const BATCH_SIZE = 5000;

function generateUsers(
	count: number,
): Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] {
	return Array.from({ length: count }, () => {
		const firstName = fake.name.first();
		const lastName = fake.name.last();

		return {
			email: fake.internet.email({ firstName, lastName }),
			username: fake.username(),
			firstName,
			lastName,
			displayName: fake.name.full(),
			bio: fake.text.bio(),
			gender: fake.enum.gender(),
			birthDate: fake.date.birthDate(),
			avatarUrl: fake.image.avatar(),
			coverImageUrl: fake.image.cover(),
			location: fake.location.city(),
			website: fake.internet.url(),
			localePreference: fake.enum.locale(),
			role: 'USER',
		};
	});
}

export async function seedUsers(prisma: PrismaClient) {
	console.log(`🌱 Seeding ${TOTAL_USERS} users...`);

	const passwordHash = await bcrypt.hash('Test123!@#', 10);
	const batches = Math.ceil(TOTAL_USERS / BATCH_SIZE);

	for (let i = 0; i < batches; i++) {
		const users = generateUsers(BATCH_SIZE);
		await prisma.user.createMany({
			data: users,
			skipDuplicates: true,
		});
		console.log(`Batch ${i + 1}/${batches} done`);
	}

	const users = await prisma.user.findMany({
		select: { id: true },
	});
	await prisma.userStats.createMany({
		data: users.map((user) => ({
			userId: user.id,
			postCount: fake.stats.postCount(),
			followerCount: fake.stats.followerCount(),
			followingCount: fake.stats.followingCount(),
			likesGiven: fake.stats.likesGiven(),
			likesReceived: fake.stats.likesReceived(),
		})),
		skipDuplicates: true,
	});
	await prisma.authProvider.createMany({
		data: users.map((u) => ({
			userId: u.id,
			provider: AuthProviderType.LOCAL,
			password: passwordHash,
		})),
	});

	console.log('Seed completed');
}

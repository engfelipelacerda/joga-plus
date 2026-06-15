import { Prisma } from '../generated/prisma/client.ts';
import { prisma } from '../database/connection.js';

export class duplicateKeyError extends Error {}
export class invalidId extends Error {}

class _userRepository {
	async listAllUsers() {
		return await prisma.users.findMany();
	}

	async createUser(data) {
		try {
			return await prisma.users.create({
				data,
			});
		} catch (error) {
			if (error.code == 'P2002') throw new duplicateKeyError();
		}
	}

	async updateUser(id, data) {
		try {
			return await prisma.users.update({
				where: { id },
				data,
			});
		} catch (error) {
			if (error.code == 'P2025') throw new invalidId();
		}
	}

	async findUserByUsername(username) {
		try {
			return await prisma.users.findUnique({
				where: { username },
			});
		} catch (error) {}
	}

	async removeUser(id) {
		try {
			return await prisma.users.delete({
				where: { id },
			});
		} catch (error) {
			if (error.code == 'P2025') throw new invalidId();
		}
	}
}
export const userRepository = new _userRepository();

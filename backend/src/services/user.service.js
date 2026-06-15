import bcrypt from 'bcrypt';
import {
	userRepository,
	duplicateKeyError,
	invalidId,
} from '../repository/user.repository.js';
import appError from '../domain/appError.js';

async function hashPassword(password) {
	return await bcrypt.hash(password, 10);
}

export default new (class userService {
	async findById(id) {
		return await userRepository.findById(id);
	}

	async create(user) {
		// adicionando encriptacao na senha
		const passwordHash = await hashPassword(user.password);
		user.password = passwordHash;

		try {
			const result = await userRepository.createUser(user);

			return result;
		} catch (error) {
			if (error instanceof duplicateKeyError)
				throw new appError('username ou email já cadastrado', 409);
			throw error;
		}
	}
	async list() {
		return await userRepository.listAllUsers();
	}
	async update(id, user) {
		const passwordHash = await hashPassword(user.password);
		user.password = passwordHash;

		try {
			const result = await userRepository.updateUser(id, user);
			return result;
		} catch (error) {
			if (error instanceof invalidId) throw new appError('ID não encontrado', 404);
			throw error;
		}
	}
	async remove(id) {
		try {
			const result = await userRepository.removeUser(id);
			return result;
		} catch (error) {
			if (error instanceof invalidId) throw new appError('ID não encontrado', 404);
			throw error;
		}
	}
})();

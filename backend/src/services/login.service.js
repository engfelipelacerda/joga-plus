import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import appError from '../domain/appError.js';
import { userRepository } from '../repository/user.repository.js';

class loginService {
	async create(body) {
		const { username, password } = body;

		const user = await userRepository.findUserByUsername(username);

		if (!user) throw new appError('Username não registrado', 401);

		const validPassword = await bcrypt.compare(password, user.password);

		if (!validPassword) throw new appError('Senha inválida', 403);

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
			expiresIn: '1d',
		});

		return token;
	}
}
export default new loginService();

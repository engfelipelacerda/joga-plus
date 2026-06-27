import bcrypt from './mocks/bcrypt.mock.js';
import jwt from './mocks/jwt.mock.js';

import './mocks/connection.mock.js';
import userRepository from './mocks/user.repository.mock.js';

import loginService from '../src/services/login.service.js';

describe('UT11 Deve chamar UserRepository.findUserByUsername com o username informado.', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});
	const username = 'Fulano';

	it('deve chamar findUserByUsername com o username recebido', async () => {
		userRepository.findUserByUsername.mockResolvedValue({
			id: 1,
			username,
			password: 'changeme',
		});

		await loginService.create({
			username,
			password: 'changeme',
		});

		expect(userRepository.findUserByUsername).toHaveBeenCalledTimes(1);
		expect(userRepository.findUserByUsername).toHaveBeenCalledWith(username);
	});
});

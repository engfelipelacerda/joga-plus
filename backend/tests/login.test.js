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
			hash: 'changeme',
		});

		await loginService.create({
			username,
			password: 'changeme',
		});

		expect(userRepository.findUserByUsername).toHaveBeenCalledTimes(1);
		expect(userRepository.findUserByUsername).toHaveBeenCalledWith(username);
	});
});

describe('UT01 Autenticar usuário com credenciais válidas.', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});
	it('deve receber um token no fim do processo.', async () => {
		const credentials = {
			username: 'Fulano',
			password: 'changeme',
		};
		const fakeUser = {
			id: 1,
			username: 'Fulano',
			hash: 'hashed password',
		};

		userRepository.findUserByUsername.mockResolvedValue(fakeUser);
		bcrypt.compare.mockResolvedValue(true);
		jwt.sign.mockReturnValue('fake-token');

		const result = await loginService.create(credentials);
		expect(result).toEqual('fake-token');
	});
});

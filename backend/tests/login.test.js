import z from 'zod';
import bcrypt from './mocks/bcrypt.mock.js';
import jwt from './mocks/jwt.mock.js';

import './mocks/connection.mock.js';
import userRepository from './mocks/user.repository.mock.js';

import loginService from '../src/services/login.service.js';
import { signIn } from '../src/controller/loginController.js';
import errorHandler from '../src/middlewares/errorHandler.js';

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

describe('UT02 Rejeitar usuário inexistente.', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});
	it('deve lançar um erro quando o username não estiver cadastrado', async () => {
		const credentials = {
			username: 'Fulano',
			password: 'changeme',
		};

		userRepository.findUserByUsername.mockResolvedValue(null);

		await expect(loginService.create(credentials)).rejects.toThrow(
			'Username não registrado',
		);
	});
});

describe('UT03 Rejeitar senha incorreta.', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});
	it('deve lançar um erro quando a comparação com senha do banco não bater', async () => {
		const credentials = {
			username: 'Fulano',
			password: 'qwerty',
		};

		const fakeUser = {
			id: 1,
			username: 'Fulano',
			password: 'hashed',
		};
		userRepository.findUserByUsername.mockResolvedValue(fakeUser);
		bcrypt.compare.mockResolvedValue(false);

		await expect(loginService.create(credentials)).rejects.toThrow(
			'Senha inválida',
		);
	});
});

describe('UT04 Gerar JWT.', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});
	it('deve garantir a geração do JWT', async () => {
		const credentials = {
			username: 'Fulano',
			password: 'changeme',
		};

		const fakeUser = {
			id: 1,
			username: 'Fulano',
			password: 'hashed',
		};

		userRepository.findUserByUsername.mockResolvedValue(fakeUser);
		bcrypt.compare.mockResolvedValue(true);
		jwt.sign.mockReturnValue('fake-token');

		const result = await loginService.create(credentials);
		expect(result).toBe('fake-token');
	});
});

describe('UT12 Deve retornar erro quando o repositório lançar uma exceção.', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});
	it('Retorna um erro genérico quando o repository levantar exceção', async () => {
		const credentials = {
			username: 'Fulano',
			password: 'changeme',
		};

		const dbError = new Error('Falha no banco');

		userRepository.findUserByUsername.mockRejectedValue(dbError);

		await expect(loginService.create(credentials)).rejects.toThrow(dbError);
	});
});

describe('UT13 Deve chamar bcrypt.compare com a senha informada e o hash armazenado.', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});
	it('Assegurar os argumentos da função compare', async () => {
		const credentials = {
			username: 'Fulano',
			password: 'changeme',
		};

		const fakeUser = {
			id: 1,
			username: 'Fulano',
			password: 'hashed',
		};

		userRepository.findUserByUsername.mockResolvedValue(fakeUser);
		bcrypt.compare.mockResolvedValue(true);

		jwt.sign.mockReturnValue('fake-token');

		await loginService.create(credentials);

		expect(bcrypt.compare).toHaveBeenCalledTimes(1);

		expect(bcrypt.compare).toHaveBeenCalledWith(
			credentials.password,
			fakeUser.password,
		);
	});
});

describe('UT14 Deve gerar JWT contendo o ID do usuário.', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});
	it('Assegurar os argumentos da função sign', async () => {
		const credentials = {
			username: 'Fulano',
			password: 'changeme',
		};

		const fakeUser = {
			id: 1,
			username: 'Fulano',
			password: 'hashed',
		};

		process.env.JWT_SECRET = 'test-secret';

		userRepository.findUserByUsername.mockResolvedValue(fakeUser);
		bcrypt.compare.mockResolvedValue(true);

		jwt.sign.mockReturnValue('fake-token');

		await loginService.create(credentials);

		expect(jwt.sign).toHaveBeenCalledTimes(1);
		expect(jwt.sign).toHaveBeenCalledWith({ id: fakeUser.id }, 'test-secret', {
			expiresIn: '1d',
		});
	});
});

describe('UT15 Controller - Login validation', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Deve retornar 400 quando o body for inválido(ZodError)', async () => {
		const req = {
			body: {
				username: 'Fulano',
				//password faltando -> erro
			},
		};

		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		const next = jest.fn();

		await signIn(req, res, next);

		expect(next).toHaveBeenCalled();

		const error = next.mock.calls[0][0];

		expect(error.name).toBe('ZodError');
	});
});

describe('Error Handler', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});
	it('Deve retornar 400 para ZodError', () => {
		let error;

		try {
			z.object({
				password: z.string(),
			}).parse({});
		} catch (err) {
			error = err;
		}
		console.log(error);

		const req = {};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		const next = jest.fn();

		errorHandler(error, req, res, next);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			code: 'VALIDATION_ERROR',
			errors: error.flatten().fieldErrors,
		});
	});
});

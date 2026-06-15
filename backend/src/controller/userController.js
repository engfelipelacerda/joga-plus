import z from 'zod';

import userBodySchema from '../schemas/user.schema.js';
import userService from '../services/user.service.js';

export async function list(req, res) {
	try {
		const listUsers = await userService.list();
		return res.status(200).json(listUsers);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			error: true,
			message: 'Erro ao listar usuários.',
		});
	}
}

export async function me(req, res) {
	try {
		const response = await userService.findById(req.user.id);

		if (!response) {
			return res.status(404).json({
				error: true,
				message: 'Usuário não encontrado.',
			});
		}

		return res.status(200).json(response);
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			error: true,
			message: 'Erro ao buscar usuário.',
		});
	}
}

export async function create(req, res, next) {
	try {
		// validate before saving the new user
		const user = userBodySchema.parse(req.body);

		const response = await userService.create(user);
		return res.status(201).json(response);
	} catch (error) {
		console.error(error);
		next(error);
	}
}

export async function update(req, res, next) {
	try {
		const paramSchema = z.object({
			id: z.coerce.number(),
		});
		const { id } = paramSchema.parse(req.params);

		// validate before saving the new client
		const user = userBodySchema.parse(req.body);

		const response = await userService.update(id, user);
		return res.status(200).json(response);
	} catch (error) {
		console.error(error);
		next(error);
	}
}

export async function remove(req, res) {
	try {
		const paramSchema = z.object({
			id: z.coerce.number(),
		});

		const { id } = paramSchema.parse(req.params);

		const response = await userService.remove(id);

		return res.status(200).json(response);
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			error: true,
			message: 'Erro ao remover usuário.',
		});
	}
}

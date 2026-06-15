import z from 'zod';
import loginService from '../services/login.service.js';

export async function signIn(req, res, next) {
	const bodySchema = z.object({
		username: z.string(),
		password: z.string(),
	});

	try {
		const body = bodySchema.parse(req.body);
		const token = await loginService.create(body);
		return res.status(200).json({ token });
	} catch (error) {
		console.error(error);
		next(error);
	}
}

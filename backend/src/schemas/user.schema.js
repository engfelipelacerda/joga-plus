import z from 'zod';

const userBodySchema = z.object({
	username: z.string({
		error: () => ({ message: 'username é obrigatório' }),
	}),
	email: z
		.string({
			error: () => ({ message: 'Email vázio' }),
		})
		.email({
			error: () => ({ message: 'Email Inválido.' }),
		}),
	birth_date: z.coerce.date({
		error: () => ({ message: 'Data de nascimento inválida.' }),
	}),
	password: z.string({
		error: () => ({ message: 'password é obrigatório' }),
	}),
});

export default userBodySchema;

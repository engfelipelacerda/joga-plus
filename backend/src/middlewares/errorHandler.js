import { ZodError } from 'zod';
import appError from '../domain/appError.js';

export default function errorHandler(error, req, res, next) {
	if (error instanceof ZodError)
		return res.status(400).json({
			code: 'VALIDATION_ERROR',
			errors: error.flatten().fieldErrors,
		});
	if (error instanceof appError)
		return res.status(error.status).json({
			error: error.message,
		});
}

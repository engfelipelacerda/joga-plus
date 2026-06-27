import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mocks hoisted para garantir que são carregados antes dos imports do módulo
const { assessmentModelMock, listModelMock } = vi.hoisted(() => ({
	assessmentModelMock: {
		create: vi.fn(),
		findByUserAndGame: vi.fn(),
		findAllByUser: vi.fn(),
		getAverageByGame: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	},
	listModelMock: {
		findByUserAndGame: vi.fn(),
	},
}));

vi.mock('../../src/modules/assessment/assessmentModel.js', () => ({
	default: assessmentModelMock,
}));

vi.mock('../../src/modules/list/listModel.js', () => ({
	default: listModelMock,
}));

const { default: assessmentController } =
	await import('../../src/modules/assessment/assessmentController.js');

// Helpers para montar req e res sem depender do Express
function mockReq({ user = { id: 1 }, body = {}, params = {} } = {}) {
	return { user, body, params };
}

function mockRes() {
	return {
		statusCode: 200,
		body: undefined,
		status(code) {
			this.statusCode = code;
			return this;
		},
		json(payload) {
			this.body = payload;
			return this;
		},
	};
}

describe('assessmentController - módulo de avaliações', () => {
	beforeEach(() => {
		vi.clearAllMocks();

		// Defaults felizes para cada mock
		listModelMock.findByUserAndGame.mockResolvedValue({
			id: 1,
			jogo_id: 10,
			tipo_lista: 'jogados',
		});
		assessmentModelMock.findByUserAndGame.mockResolvedValue(null);
		assessmentModelMock.create.mockResolvedValue({ id: 1 });
		assessmentModelMock.findAllByUser.mockResolvedValue([]);
		assessmentModelMock.getAverageByGame.mockResolvedValue({
			media: 4.2,
			total: 5,
		});
		assessmentModelMock.update.mockResolvedValue({ id: 1 });
		assessmentModelMock.delete.mockResolvedValue({ id: 1 });
	});

	// ─── create ────────────────────────────────────────────────────────────────

	it('1. create retorna 400 quando jogo_id não for enviado', async () => {
		const req = mockReq({ body: { nota: 4 } });
		const res = mockRes();

		await assessmentController.create(req, res);

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe('Informe jogo_id e nota.');
		expect(listModelMock.findByUserAndGame).not.toHaveBeenCalled();
	});

	it('2. create retorna 400 quando nota não for enviada', async () => {
		const req = mockReq({ body: { jogo_id: 10 } });
		const res = mockRes();

		await assessmentController.create(req, res);

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe('Informe jogo_id e nota.');
	});

	it('3. create retorna 400 quando nota for menor que 0', async () => {
		const req = mockReq({ body: { jogo_id: 10, nota: -1 } });
		const res = mockRes();

		await assessmentController.create(req, res);

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe('Nota deve ser entre 0 e 5.');
		expect(listModelMock.findByUserAndGame).not.toHaveBeenCalled();
	});

	it('4. create retorna 400 quando nota for maior que 5', async () => {
		const req = mockReq({ body: { jogo_id: 10, nota: 6 } });
		const res = mockRes();

		await assessmentController.create(req, res);

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe('Nota deve ser entre 0 e 5.');
	});

	it('5. create retorna 400 quando comentário exceder 500 caracteres', async () => {
		const req = mockReq({
			body: { jogo_id: 10, nota: 3, comentario: 'x'.repeat(501) },
		});
		const res = mockRes();

		await assessmentController.create(req, res);

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe('Comentário não pode exceder 500 caracteres.');
		expect(listModelMock.findByUserAndGame).not.toHaveBeenCalled();
	});

	it('6. create retorna 403 quando o jogo não estiver na lista "jogados"', async () => {
		listModelMock.findByUserAndGame.mockResolvedValue({
			id: 1,
			jogo_id: 10,
			tipo_lista: 'backlog', // não é "jogados"
		});
		const req = mockReq({ body: { jogo_id: 10, nota: 4 } });
		const res = mockRes();

		await assessmentController.create(req, res);

		expect(listModelMock.findByUserAndGame).toHaveBeenCalledWith(1, 10);
		expect(res.statusCode).toBe(403);
		expect(res.body.message).toBe(
			"Você só pode avaliar jogos da lista 'jogados'.",
		);
	});

	it('7. create retorna 403 quando o jogo não estiver em nenhuma lista do usuário', async () => {
		listModelMock.findByUserAndGame.mockResolvedValue(null);
		const req = mockReq({ body: { jogo_id: 10, nota: 4 } });
		const res = mockRes();

		await assessmentController.create(req, res);

		expect(res.statusCode).toBe(403);
	});

	it('8. create retorna 409 quando o usuário já avaliou o jogo', async () => {
		assessmentModelMock.findByUserAndGame.mockResolvedValue({ id: 5 });
		const req = mockReq({ body: { jogo_id: 10, nota: 4 } });
		const res = mockRes();

		await assessmentController.create(req, res);

		expect(assessmentModelMock.findByUserAndGame).toHaveBeenCalledWith(1, 10);
		expect(res.statusCode).toBe(409);
		expect(res.body.message).toBe(
			'Você já avaliou esse jogo. Use o método de edição.',
		);
	});

	it('9. create cria avaliação e retorna 201 quando todos os dados são válidos', async () => {
		const req = mockReq({
			user: { id: 2 },
			body: { jogo_id: 10, nota: 5, comentario: 'Ótimo jogo!' },
		});
		const res = mockRes();

		await assessmentController.create(req, res);

		expect(assessmentModelMock.create).toHaveBeenCalledWith({
			usuario_id: 2,
			jogo_id: 10,
			nota: 5,
			comentario: 'Ótimo jogo!',
		});
		expect(res.statusCode).toBe(201);
		expect(res.body.message).toBe('Avaliação criada com sucesso.');
	});

	// ─── listAll ────────────────────────────────────────────────────────────────

	it('10. listAll retorna 200 com todas as avaliações do usuário', async () => {
		const items = [
			{ id: 1, jogo_id: 10, nota: 4 },
			{ id: 2, jogo_id: 11, nota: 3 },
		];
		assessmentModelMock.findAllByUser.mockResolvedValue(items);
		const req = mockReq({ user: { id: 5 } });
		const res = mockRes();

		await assessmentController.listAll(req, res);

		expect(assessmentModelMock.findAllByUser).toHaveBeenCalledWith(5);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual(items);
	});

	// ─── getByGame ──────────────────────────────────────────────────────────────

	it('11. getByGame retorna 200 com avaliação e média do jogo', async () => {
		assessmentModelMock.findByUserAndGame.mockResolvedValue({ id: 1, nota: 4 });
		assessmentModelMock.getAverageByGame.mockResolvedValue({
			media: 3.8,
			total: 10,
		});
		const req = mockReq({ user: { id: 1 }, params: { jogo_id: '10' } });
		const res = mockRes();

		await assessmentController.getByGame(req, res);

		expect(assessmentModelMock.findByUserAndGame).toHaveBeenCalledWith(1, '10');
		expect(assessmentModelMock.getAverageByGame).toHaveBeenCalledWith('10');
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			assessment: { id: 1, nota: 4 },
			average: { media: 3.8, total: 10 },
		});
	});

	// ─── update ─────────────────────────────────────────────────────────────────

	it('12. update retorna 400 quando jogo_id não for enviado', async () => {
		const req = mockReq({ body: { nota: 3 } });
		const res = mockRes();

		await assessmentController.update(req, res);

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe('Informe jogo_id e nota.');
	});

	it('13. update retorna 400 quando nota estiver fora do intervalo', async () => {
		const req = mockReq({ body: { jogo_id: 10, nota: 10 } });
		const res = mockRes();

		await assessmentController.update(req, res);

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe('Nota deve ser entre 0 e 5.');
	});

	it('14. update retorna 404 quando a avaliação não existir', async () => {
		assessmentModelMock.findByUserAndGame.mockResolvedValue(null);
		const req = mockReq({ body: { jogo_id: 10, nota: 3 } });
		const res = mockRes();

		await assessmentController.update(req, res);

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('Avaliação não encontrada.');
	});

	it('15. update atualiza avaliação e retorna 200 quando os dados são válidos', async () => {
		assessmentModelMock.findByUserAndGame.mockResolvedValue({ id: 1 });
		const req = mockReq({
			user: { id: 3 },
			body: { jogo_id: 10, nota: 2, comentario: 'Decepcionante.' },
		});
		const res = mockRes();

		await assessmentController.update(req, res);

		expect(assessmentModelMock.update).toHaveBeenCalledWith(3, 10, {
			nota: 2,
			comentario: 'Decepcionante.',
		});
		expect(res.statusCode).toBe(200);
		expect(res.body.message).toBe('Avaliação atualizada com sucesso.');
	});

	// ─── remove ─────────────────────────────────────────────────────────────────

	it('16. remove retorna 404 quando a avaliação não existir', async () => {
		assessmentModelMock.findByUserAndGame.mockResolvedValue(null);
		const req = mockReq({ params: { jogo_id: '99' } });
		const res = mockRes();

		await assessmentController.remove(req, res);

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('Avaliação não encontrada.');
		expect(assessmentModelMock.delete).not.toHaveBeenCalled();
	});

	it('17. remove exclui avaliação existente e retorna 200', async () => {
		assessmentModelMock.findByUserAndGame.mockResolvedValue({ id: 1 });
		const req = mockReq({ user: { id: 4 }, params: { jogo_id: '10' } });
		const res = mockRes();

		await assessmentController.remove(req, res);

		expect(assessmentModelMock.delete).toHaveBeenCalledWith(4, '10');
		expect(res.statusCode).toBe(200);
		expect(res.body.message).toBe('Avaliação removida com sucesso.');
	});
});

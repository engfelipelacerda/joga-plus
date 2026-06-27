import { beforeEach, describe, expect, it, vi } from 'vitest';

const { listModelMock, gameModelMock } = vi.hoisted(() => ({
	listModelMock: {
		create: vi.fn(),
		findByUser: vi.fn(),
		findByUserAndType: vi.fn(),
		findByUserAndGame: vi.fn(),
		updateType: vi.fn(),
		updatePriority: vi.fn(),
		updateStatus: vi.fn(),
		delete: vi.fn(),
	},
	gameModelMock: {
		findById: vi.fn(),
	},
}));

vi.mock('../../src/modules/list/listModel.js', () => ({
	default: listModelMock,
}));

vi.mock('../../src/modules/games/gameModel.js', () => ({
	default: gameModelMock,
}));

const { default: listController } =
	await import('../../src/modules/list/listController.js');

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

describe('listController - módulo de listas, favoritos e backlog', () => {
	beforeEach(() => {
		vi.clearAllMocks();

		gameModelMock.findById.mockResolvedValue({ id: 10, titulo: 'Hades' });
		listModelMock.create.mockResolvedValue({ id: 1 });
		listModelMock.findByUser.mockResolvedValue([]);
		listModelMock.findByUserAndType.mockResolvedValue([]);
		listModelMock.findByUserAndGame.mockResolvedValue(null);
		listModelMock.updateType.mockResolvedValue({ id: 1 });
		listModelMock.updatePriority.mockResolvedValue({ id: 1 });
		listModelMock.updateStatus.mockResolvedValue({ id: 1 });
		listModelMock.delete.mockResolvedValue({ usuario_id: 1, jogo_id: 10 });
	});

	it('1. add retorna 400 quando jogo_id ou tipo_lista não forem enviados', async () => {
		const req = mockReq({ body: { jogo_id: 10 } });
		const res = mockRes();

		await listController.add(req, res);

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe('Informe jogo_id e tipo_lista.');
		expect(gameModelMock.findById).not.toHaveBeenCalled();
	});

	it('2. add retorna 400 quando tipo_lista for inválido', async () => {
		const req = mockReq({ body: { jogo_id: 10, tipo_lista: 'lista_invalida' } });
		const res = mockRes();

		await listController.add(req, res);

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toMatch(/tipo_lista deve ser um dos/);
		expect(gameModelMock.findById).not.toHaveBeenCalled();
	});

	it('3. add retorna 400 quando prioridade estiver fora do intervalo permitido', async () => {
		const req = mockReq({
			body: { jogo_id: 10, tipo_lista: 'favoritos', prioridade: 9 },
		});
		const res = mockRes();

		await listController.add(req, res);

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe('Prioridade deve ser entre 1 e 5.');
		expect(gameModelMock.findById).not.toHaveBeenCalled();
	});

	it('4. add retorna 404 quando o jogo não existir no banco', async () => {
		gameModelMock.findById.mockResolvedValue(null);
		const req = mockReq({ body: { jogo_id: 999, tipo_lista: 'favoritos' } });
		const res = mockRes();

		await listController.add(req, res);

		expect(gameModelMock.findById).toHaveBeenCalledWith(999);
		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('Jogo não encontrado no banco.');
	});

	it('5. add retorna 409 quando o jogo já estiver na lista do usuário', async () => {
		listModelMock.findByUserAndGame.mockResolvedValue({ id: 1, jogo_id: 10 });
		const req = mockReq({ body: { jogo_id: 10, tipo_lista: 'favoritos' } });
		const res = mockRes();

		await listController.add(req, res);

		expect(listModelMock.findByUserAndGame).toHaveBeenCalledWith(1, 10);
		expect(res.statusCode).toBe(409);
		expect(res.body.message).toBe('Jogo já está na sua lista.');
	});

	it('6. add cria item na lista e retorna 201 quando os dados forem válidos', async () => {
		const req = mockReq({
			user: { id: 7 },
			body: { jogo_id: 10, tipo_lista: 'backlog', prioridade: 4 },
		});
		const res = mockRes();

		await listController.add(req, res);

		expect(listModelMock.create).toHaveBeenCalledWith({
			usuario_id: 7,
			jogo_id: 10,
			tipo_lista: 'backlog',
			prioridade: 4,
		});
		expect(res.statusCode).toBe(201);
		expect(res.body.message).toBe('Jogo adicionado à lista com sucesso.');
	});

	it('7. listAll retorna 200 com todos os jogos das listas do usuário', async () => {
		const items = [
			{ id: 1, jogo_id: 10, tipo_lista: 'favoritos' },
			{ id: 2, jogo_id: 11, tipo_lista: 'backlog' },
		];
		listModelMock.findByUser.mockResolvedValue(items);
		const req = mockReq({ user: { id: 3 } });
		const res = mockRes();

		await listController.listAll(req, res);

		expect(listModelMock.findByUser).toHaveBeenCalledWith(3);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual(items);
	});

	it('8. listByType retorna 400 quando o tipo informado na rota for inválido', async () => {
		const req = mockReq({ params: { tipo: 'tipo_errado' } });
		const res = mockRes();

		await listController.listByType(req, res);

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toMatch(/tipo deve ser um dos/);
		expect(listModelMock.findByUserAndType).not.toHaveBeenCalled();
	});

	it('9. moveToList move jogo existente para outra lista e retorna 200', async () => {
		listModelMock.findByUserAndGame.mockResolvedValue({ id: 1, jogo_id: 10 });
		const req = mockReq({ body: { jogo_id: 10, tipo_lista: 'jogados' } });
		const res = mockRes();

		await listController.moveToList(req, res);

		expect(listModelMock.updateType).toHaveBeenCalledWith(1, 10, 'jogados');
		expect(res.statusCode).toBe(200);
		expect(res.body.message).toBe('Jogo movido com sucesso.');
	});

	it('10. remove exclui jogo existente da lista e retorna 200', async () => {
		listModelMock.findByUserAndGame.mockResolvedValue({ id: 1, jogo_id: 10 });
		const req = mockReq({ params: { jogo_id: '10' } });
		const res = mockRes();

		await listController.remove(req, res);

		expect(listModelMock.delete).toHaveBeenCalledWith(1, '10');
		expect(res.statusCode).toBe(200);
		expect(res.body.message).toBe('Jogo removido da lista com sucesso.');
	});
});

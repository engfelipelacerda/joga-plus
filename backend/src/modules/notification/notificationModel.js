import { prisma } from '../../database/connection.js';

class NotificationModel {
	async create(data) {
		return await prisma.notifications.create({
			data: {
				usuario_id: data.usuario_id,
				jogo_id: data.jogo_id,
				mensagem: data.mensagem,
			},
		});
	}

	async findAllByUser(usuario_id) {
		return await prisma.notifications.findMany({
			where: { usuario_id },
			include: {
				jogo: { select: { titulo: true, imagem_url: true } },
			},
			orderBy: { data_envio: 'desc' },
		});
	}

	async findUnreadByUser(usuario_id) {
		return await prisma.notifications.findMany({
			where: { usuario_id, lida: false },
			include: {
				jogo: { select: { titulo: true, imagem_url: true } },
			},
			orderBy: { data_envio: 'desc' },
		});
	}

	async markAsRead(id, usuario_id) {
		const notification = await prisma.notifications.findFirst({
			where: { id: Number(id), usuario_id },
		});
		if (!notification) return null;
		return await prisma.notifications.update({
			where: { id: Number(id) },
			data: { lida: true },
		});
	}

	async markAllAsRead(usuario_id) {
		return await prisma.notifications.updateMany({
			where: { usuario_id, lida: false },
			data: { lida: true },
		});
	}

	async delete(id, usuario_id) {
		const notification = await prisma.notifications.findFirst({
			where: { id: Number(id), usuario_id },
		});
		if (!notification) return null;
		return await prisma.notifications.delete({
			where: { id: Number(id) },
		});
	}

	async countUnread(usuario_id) {
		return await prisma.notifications.count({
			where: { usuario_id, lida: false },
		});
	}
}

export default new NotificationModel();


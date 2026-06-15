import notificationModel from './notificationModel.js';

// Lista todas as notificações do usuário
const listAll = async (req, res) => {
	const usuario_id = req.user.id;
	try {
		const notifications = await notificationModel.findAllByUser(usuario_id);
		const unreadCount = await notificationModel.countUnread(usuario_id);
		return res.status(200).json({ unreadCount, notifications });
	} catch (error) {
		console.error('Erro ao listar notificações:', error);
		return res.status(500).json({ message: 'Erro ao listar notificações.' });
	}
};

// Lista apenas notificações não lidas
const listUnread = async (req, res) => {
	const usuario_id = req.user.id;
	try {
		const notifications = await notificationModel.findUnreadByUser(usuario_id);
		return res.status(200).json({ total: notifications.length, notifications });
	} catch (error) {
		console.error('Erro ao listar notificações não lidas:', error);
		return res
			.status(500)
			.json({ message: 'Erro ao listar notificações não lidas.' });
	}
};

// Marca uma notificação como lida
const markAsRead = async (req, res) => {
	const usuario_id = req.user.id;
	const { id } = req.params;
	try {
		const result = await notificationModel.markAsRead(id, usuario_id);
		if (!result)
			return res.status(404).json({ message: 'Notificação não encontrada.' });
		return res.status(200).json({ message: 'Notificação marcada como lida.' });
	} catch (error) {
		console.error('Erro ao marcar notificação como lida:', error);
		return res
			.status(500)
			.json({ message: 'Erro ao marcar notificação como lida.' });
	}
};

// Marca todas as notificações como lidas
const markAllAsRead = async (req, res) => {
	const usuario_id = req.user.id;
	try {
		await notificationModel.markAllAsRead(usuario_id);
		return res
			.status(200)
			.json({ message: 'Todas as notificações marcadas como lidas.' });
	} catch (error) {
		console.error('Erro ao marcar notificações como lidas:', error);
		return res
			.status(500)
			.json({ message: 'Erro ao marcar notificações como lidas.' });
	}
};

// Remove uma notificação
const remove = async (req, res) => {
	const usuario_id = req.user.id;
	const { id } = req.params;
	try {
		const result = await notificationModel.delete(id, usuario_id);
		if (!result)
			return res.status(404).json({ message: 'Notificação não encontrada.' });
		return res.status(200).json({ message: 'Notificação removida com sucesso.' });
	} catch (error) {
		console.error('Erro ao remover notificação:', error);
		return res.status(500).json({ message: 'Erro ao remover notificação.' });
	}
};

export default { listAll, listUnread, markAsRead, markAllAsRead, remove };


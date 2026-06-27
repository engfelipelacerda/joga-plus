import app from './app.js';
import { ensureListsSchema } from './database/ensureListsSchema.js';

const port = 3333;

async function startServer() {
	await ensureListsSchema();

	app.listen(port, (error) => {
		if (error) {
			console.log('Express deu erro!');
			return;
		}
		console.log('Express subiu!');
	}); // porta para o servidor ler/ouvir
}

startServer().catch((error) => {
	console.error('Erro ao preparar o banco/iniciar o servidor:', error);
	process.exit(1);
});

import { prisma } from './connection.js';

const REQUIRED_TIPOS = [
	'desejados',
	'nao_jogados',
	'jogados',
	'jogar_novamente',
	'backlog',
	'favoritos',
];

const REQUIRED_STATUS = ['quer_jogar', 'joguei', 'talvez'];

function enumSql(values) {
	return values.map((value) => `'${value}'`).join(', ');
}

async function columnExists(tableName, columnName) {
	const rows = await prisma.$queryRawUnsafe(
		`SELECT COUNT(*) AS total
		 FROM INFORMATION_SCHEMA.COLUMNS
		 WHERE TABLE_SCHEMA = DATABASE()
		   AND TABLE_NAME = ?
		   AND COLUMN_NAME = ?`,
		tableName,
		columnName,
	);

	return Number(rows?.[0]?.total ?? 0) > 0;
}

async function tableExists(tableName) {
	const rows = await prisma.$queryRawUnsafe(
		`SELECT COUNT(*) AS total
		 FROM INFORMATION_SCHEMA.TABLES
		 WHERE TABLE_SCHEMA = DATABASE()
		   AND TABLE_NAME = ?`,
		tableName,
	);

	return Number(rows?.[0]?.total ?? 0) > 0;
}

export async function ensureListsSchema() {
	const exists = await tableExists('lists');
	if (!exists) {
		console.warn('[Banco] Tabela lists não encontrada. Rode as migrations/schema antes de iniciar o app.');
		return;
	}

	// Garante que a enum aceite as listas novas usadas pelo front.
	await prisma.$executeRawUnsafe(
		`ALTER TABLE \`lists\`
		 MODIFY COLUMN \`tipo_lista\` ENUM(${enumSql(REQUIRED_TIPOS)}) NOT NULL`,
	);

	// O erro enviado foi exatamente aqui: a tabela antiga não tinha a coluna status.
	// Antes de qualquer SELECT/INSERT em lists, criamos a coluna caso ela não exista.
	const hasStatus = await columnExists('lists', 'status');
	if (!hasStatus) {
		await prisma.$executeRawUnsafe(
			`ALTER TABLE \`lists\`
			 ADD COLUMN \`status\` ENUM(${enumSql(REQUIRED_STATUS)}) NOT NULL DEFAULT 'quer_jogar' AFTER \`prioridade\``,
		);
	}

	await prisma.$executeRawUnsafe(
		`UPDATE \`lists\`
		 SET \`status\` = 'quer_jogar'
		 WHERE \`status\` IS NULL OR \`status\` = ''`,
	);

	console.log('[Banco] Schema da tabela lists verificado.');
}

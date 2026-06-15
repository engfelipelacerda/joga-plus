import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client.ts';
import dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaMariaDb({
	host: process.env.MYSQL_HOST,
	port: Number(process.env.MYSQL_PORT),
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
});

export const prisma = new PrismaClient({ adapter });

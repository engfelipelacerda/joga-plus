import bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
	compare: jest.fn().mockResolvedValue(true),
}));

export default bcrypt;

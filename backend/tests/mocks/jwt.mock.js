import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
	sign: jest.fn().mockReturnValue('fake-token'),
}));

export default jwt;

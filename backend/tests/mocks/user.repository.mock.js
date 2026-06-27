import userRepository from '../../src/repository/user.repository.js';

jest.mock('../../src/repository/user.repository.js', () => ({
	__esModule: true,
	default: {
		findUserByUsername: jest.fn(),
	},
}));

export default userRepository;

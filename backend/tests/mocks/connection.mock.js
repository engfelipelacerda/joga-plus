jest.mock('../../src/database/connection.js', () => {
	return {
		__esModule: true,
		default: require('jest-mock-extended').mockDeep(),
	};
});

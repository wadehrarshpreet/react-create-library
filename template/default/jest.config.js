module.exports = {
	testPathIgnorePatterns: [
		'<rootDir>/dist/',
		'<rootDir>/docs/',
		'<rootDir>/example/',
		{{#ifCond documentation '===' 'docz'}}
		'<rootDir>/.docz/',
		{{/ifCond}}
		'<rootDir>/node_modules/',
	],
	{{#ifCond typeSystem '===' 'typescript'}}
	testMatch: [
		'**/__tests__/**/*.+(ts|tsx|js)',
		'**/?(*.)+(spec|test).+(ts|tsx|js)',
	],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	{{/ifCond}}
	verbose: true,
	moduleNameMapper: {
		'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'<rootDir>/__mocks__/fileMock.js',
		'\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',
	},
};

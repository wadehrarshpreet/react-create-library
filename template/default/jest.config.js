module.exports = {
	testPathIgnorePatterns: [
		'<rootDir>/dist/',
		'<rootDir>/docs/',
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
};

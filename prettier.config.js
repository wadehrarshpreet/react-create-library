module.exports = {
	printWidth: 80,
	useTabs: true,
	tabWidth: 2,
	singleQuote: true,
	semi: true,
	trailingComma: 'es5',
	bracketSpacing: true,
	arrowParens: 'always',
	overrides: [
		{
			files: '*.md',
			options: {
				parser: 'markdown',
			},
		},
	],
};

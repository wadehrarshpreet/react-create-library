const path = require('path');

const {
	createConfig,
	babel,
	css,
	sass,
	match,
	file,
} = require('webpack-blocks');
{{#ifCond typeSystem '===' 'typescript'}}
const typescript = require('@webpack-blocks/typescript');
{{/ifCond}}

const pkg = require('./package.json');

module.exports = {
	title: `${pkg.name} v${pkg.version}`,
	styleguideDir: 'docs',
	{{#ifCond typeSystem '===' 'typescript'}}
	components: 'src/**/[A-Z]*.{js,ts,tsx,jsx}',
	propsParser: require('react-docgen-typescript').withCustomConfig(
		'./tsconfig.json'
	).parse,
	{{else}}
	components: 'src/**/[A-Z]*.{js,jsx}',
	{{/ifCond}}
	moduleAliases: {
		[pkg.name]: path.resolve(__dirname, 'src'),
	},
	webpackConfig: createConfig([
		babel(),
		{{#ifCond typeSystem '===' 'typescript'}}
		typescript(),
		{{/ifCond}}
		css(),
		match(
			['*.scss', '!*node_modules*'],
			[css(), sass(/* node-sass options */)]
		),
		match(['*.gif', '*.jpg', '*.jpeg', '*.png', '*.svg', '*.webp'], [file()]),
	]),
};

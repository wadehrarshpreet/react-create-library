const path = require('path');

const {
	createConfig,
	babel,
	css,
	sass,
	match,
	file,
} = require('webpack-blocks');

const pkg = require('./package.json');

module.exports = {
	title: `${pkg.name} v${pkg.version}`,
	styleguideDir: 'docs/html',
	components: 'src/**/[A-Z]*.js',
	moduleAliases: {
		[pkg.name]: path.resolve(__dirname, 'src'),
	},
	webpackConfig: createConfig([
		babel(),
		css(),
		match(
			['*.scss', '!*node_modules*'],
			[css(), sass(/* node-sass options */)]
		),
		match(['*.gif', '*.jpg', '*.jpeg', '*.png', '*.svg', '*.webp'], [file()]),
	]),
	// getComponentPathLine(componentPath) {
	// 	const name = path.basename(componentPath, '.js');
	// 	return `import { ${name} } from '${pkg.name}';`;
	// },
};

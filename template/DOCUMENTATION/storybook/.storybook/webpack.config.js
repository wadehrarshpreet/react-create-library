{{#if externalCSS}}
const path = require('path');
{{/if}}
module.exports = ({ config }) => {
	{{#ifCond style '===' 'css'}}
	config.module.rules = config.module.rules.filter(
		(f) => f.test.toString() !== '/\\.css$/'
	);
	{{/ifCond}}
	{{#ifCond typeSystem '===' 'typescript'}}
	config.module.rules.push({
		test: /\.(ts|tsx)$/,
		use: [
			{
				loader: require.resolve('awesome-typescript-loader'),
			},
			{
				loader: require.resolve('react-docgen-typescript-loader'),
			},
		],
	});
	{{/ifCond}}

	config.module.rules.push({{#ifCond style '===' 'less'}}
		{
			test: /\.less$/,
			loaders: ['style-loader', 'css-loader', 'less-loader'],
			include: path.resolve(__dirname, '../src/'),
		}
	{{/ifCond}}
	{{#ifCond style '===' 'css'}}
		{
			test: /\.css$/,
			loaders: ['style-loader', 'css-loader'],
			include: path.resolve(__dirname, '../src/'),
		}
	{{/ifCond}}
	{{#ifCond style '===' 'scss'}}
		{
			test: /\.(sa|sc|c)ss$/,
			loaders: ['style-loader', 'css-loader', 'sass-loader'],
			include: path.resolve(__dirname, '../src/'),
		}
	{{/ifCond}}
	);
	{{#ifCond typeSystem '===' 'typescript'}}
	config.resolve.extensions.push('.ts', '.tsx');
	{{/ifCond}}
	return config;
};
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
module.exports = ({ pure, withModules, isUMD = false }) => ({
	presets: [{{#ifCond typeSystem '===' 'typescript'}}'@babel/preset-typescript',{{/ifCond}}{{#ifCond typeSystem '===' 'flow'}}'@babel/preset-flow',{{/ifCond}}
		'@babel/preset-react',
		...(pure
			? []
			: [
					[
						'@babel/env',
						{
							modules: withModules,
							loose: true,
							targets: {
								browsers: ['ie 10', 'ios 7'],
							},
						},
					],
			  ]),
	],
	plugins: [
		[
			'transform-react-remove-prop-types',
			{
				mode: 'unsafe-wrap',
				ignoreFilenames: ['node_modules'],
			},
		],
		['@babel/plugin-proposal-object-rest-spread', { loose: true }],
		['@babel/proposal-class-properties', { loose: true }],
		'@babel/transform-runtime',
		'minify-dead-code-elimination',
		{{#ifCond style '===' 'emotion'}}'emotion',{{/ifCond}}{{#ifCond style '===' 'styled-component'}}'babel-plugin-styled-components',{{/ifCond}}
		{{#if externalCSS}}
		...(isUMD
			? []
			: [
					[
						'babel-plugin-transform-require-ignore',
						{
							extensions: ['.less', '.scss', '.css'],
						},
					],
			  ]),
		{{/if}}
	],
	exclude: '**/*.{spec,test}.{js,jsx,tsx,ts}',
});

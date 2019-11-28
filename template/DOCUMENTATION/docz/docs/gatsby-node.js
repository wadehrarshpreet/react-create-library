{{#ifCond typeSystem '===' 'flow'}}
exports.onCreateBabelConfig = ({ actions }) => {
	actions.setBabelPreset({
		name: '@babel/preset-flow',
	});
};
{{/ifCond}}
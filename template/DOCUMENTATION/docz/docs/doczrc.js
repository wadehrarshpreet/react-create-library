export default {
	title: '{{name}}',
	dest: './html',
	menu: ['{{name}}', 'Demo App'],
	src: '../src',
	typescript: {{#ifCond typeSystem '===' 'typescript'}}true{{else}}false{{/ifCond}},
	base: '/{{name}}/', // base path of deployed docz
};

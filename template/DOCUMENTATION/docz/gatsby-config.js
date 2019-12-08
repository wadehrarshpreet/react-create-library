{{#ifCond style '===' 'less'}}
module.exports = {
	plugins: ['gatsby-plugin-less'],
};
{{/ifCond}}
{{#ifCond style '===' 'scss'}}
module.exports = {
	plugins: ['gatsby-plugin-sass'],
}
{{/ifCond}}
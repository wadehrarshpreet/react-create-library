'use-strict';

const validateNpmName = require('validate-npm-package-name');
const inquirer = require('inquirer');

const LICENSE = [
	'MIT',
	'ISC',
	'GPL',
	'BSD',
	'ApacheLicense',
	'Unlicense',
	'other',
];

const PACKAGE_MANAGER = ['npm', 'yarn'];
const TYPE_SYSTEM = ['default', 'typescript', 'flow'];
const DOCUMENTATION = ['none', 'docz', 'storybook', 'react-styleguidist'];
const STYLE = ['inline', 'css', 'less', 'scss', 'emotion', 'styled-component'];

module.exports = async (defaultAnswers) => {
	const queries = [
		{
			type: 'input',
			name: 'name',
			message: 'Package Name',
			validate: (name) => {
				return name && validateNpmName(name).validForNewPackages;
			},
			default: defaultAnswers.name,
		},
		{
			type: 'input',
			name: 'description',
			message: 'Package Description',
			default: defaultAnswers.description,
		},
		{
			type: 'input',
			name: 'author',
			message: "Author's GitHub Handle",
			default: defaultAnswers.author,
		},
		{
			type: 'input',
			name: 'repo',
			message: 'Repo Path',
			when: ({ author }) => !!author,
			default: ({ author, name }) => `${author}/${name}`,
		},
		{
			type: 'list',
			name: 'license',
			message: 'Package License',
			suggestOnly: true,
			default: defaultAnswers.license,
			choices: LICENSE,
		},
		{
			type: 'input',
			name: 'license',
			message: 'License (other)',
			when: ({ license }) => license === 'other',
		},
		{
			type: 'list',
			name: 'manager',
			message: 'Package Manager',
			choices: PACKAGE_MANAGER,
			default: defaultAnswers.manager,
		},
		{
			type: 'list',
			name: 'typeSystem',
			message: 'Package Type System',
			choices: TYPE_SYSTEM,
			default: defaultAnswers.typeSystem,
		},
		{
			type: 'list',
			name: 'documentation',
			message: 'Documentation System',
			choices: DOCUMENTATION,
			default: defaultAnswers.documentation,
		},
		{
			type: 'list',
			name: 'style',
			message: 'Style System',
			choices: STYLE,
			default: defaultAnswers.style,
		},
	];
	const userAnswers = await inquirer.prompt(queries);
	return userAnswers;
};

module.exports.PACKAGE_MANAGER = PACKAGE_MANAGER;
module.exports.TYPE_SYSTEM = TYPE_SYSTEM;
module.exports.DOCUMENTATION = DOCUMENTATION;
module.exports.STYLE = STYLE;

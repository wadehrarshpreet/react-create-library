'use-strict';

const validateNpmName = require('validate-npm-package-name');
const inquirer = require('inquirer');
inquirer.registerPrompt(
	'autocomplete',
	require('inquirer-autocomplete-prompt')
);

const LICENSE = ['MIT', 'ISC', 'GPL', 'BSD', 'ApacheLicense', 'Unlicense'];

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
			type: 'autocomplete',
			name: 'license',
			message: 'Package License',
			suggestOnly: true,
			default: defaultAnswers.license,
			source: (answersSoFar, input = '') => {
				return new Promise((resolve) => {
					resolve(
						LICENSE.filter((x) => x.toLowerCase().includes(input.toLowerCase()))
					);
				});
			},
		},
		{
			type: 'list',
			name: 'manager',
			message: 'Package Manager',
			choices: ['npm', 'yarn'],
			default: defaultAnswers.manager,
		},
		{
			type: 'list',
			name: 'typeSystem',
			message: 'Package Type System',
			choices: ['none', 'typescript', 'flow'],
			default: defaultAnswers.typeSystem,
		},
		{
			type: 'list',
			name: 'documentation',
			message: 'Documentation System',
			choices: ['none', 'docz', 'storyboard', 'react-styleguidist'],
			default: defaultAnswers.documentation,
		},
		{
			type: 'list',
			name: 'style',
			message: 'Style System',
			choices: [
				{ name: 'No style or inline style', value: 'inline' },
				'css',
				'less',
				'scss',
				'emotion',
				'styled-component',
			],
			default: defaultAnswers.style,
		},
	];
	const userAnswers = await inquirer.prompt(queries);
	return userAnswers;
};

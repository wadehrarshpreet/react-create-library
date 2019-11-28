'use strict';

const path = require('path');
const chalk = require('chalk');
const validateNpmName = require('validate-npm-package-name');

const getDefaultData = require('./default.js');
const generateTemplate = require('./makeTemplate');
const { Spinner } = require('./utils');
const getAnswerForQueries = require('./query');

module.exports = async (program, packageName) => {
	// Check Package Name Defined
	if (typeof packageName === 'undefined') {
		console.error('Please specify the package name:');
		console.log(
			`${chalk.cyan(program.name())} ${chalk.green('<package-name>')}\n`
		);
		console.log('For example:');
		console.log(
			`${chalk.cyan(program.name())} ${chalk.green('my-date-picker')}`
		);
		console.log(
			`\n Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
		);
		process.exit(1);
	}
	const packageNameValidate = validateNpmName(packageName);
	if (packageName && !packageNameValidate.validForNewPackages) {
		console.log(`${chalk.red(
			`Package name ${packageName} is invalid.`
		)}\nError: ${chalk.cyan(
			[
				...(packageNameValidate.errors || []),
				...(packageNameValidate.warnings || []),
			].join(',')
		)}
        `);
		process.exit(1);
	}

	const root = path.resolve(packageName.replace('/', '-')); // handle scope package name
	let status = new Spinner('Initializing...');
	status.start();
	const defaultOptions = await getDefaultData();
	status.stop();
	const answers = await getAnswerForQueries({
		...defaultOptions,
		name: packageName,
	});
	status.message('Setting up Boilerplate...');
	status.start();
	const templateStatus = await generateTemplate(answers, root);
	status.stop();
	console.log(root);
	console.log(answers);
	console.log(templateStatus);
};

'use strict';

const path = require('path');
const chalk = require('chalk');
const validateNpmName = require('validate-npm-package-name');
const clear = require('clear');
const getDefaultData = require('./default.js');
const figlet = require('figlet');
const generateTemplate = require('./makeTemplate');
const { Spinner, figletText } = require('./utils');
const getAnswerForQueries = require('./query');

module.exports = async (program, packageName) => {
	// Check Package Name Defined
	if (typeof packageName === 'undefined') {
		console.error('Please specify the package name:');
		console.log(
			`${chalk.cyan(program.name())} ${chalk.green(
				'<package-name>'
			)} [options]\n`
		);
		console.log('For example:');
		console.log(
			`${chalk.cyan(program.name())} ${chalk.green('my-date-picker')}`
		);
		console.log(
			`${chalk.cyan(program.name())} ${chalk.green('my-date-picker')} --pm yarn`
		);
		console.log(
			`\nRun ${chalk.cyan(`${program.name()} --help`)} to see all options.`
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
	const status = new Spinner('Initializing...');
	status.start();
	const defaultOptions = await getDefaultData(program);
	status.stop();
	let answers = { ...defaultOptions, name: packageName };
	if (program.skip !== true) {
		answers = await getAnswerForQueries({
			...defaultOptions,
			name: packageName,
		});
	}
	if (['less', 'css', 'scss'].indexOf(answers.style) !== -1) {
		answers.externalCSS = true;
	}
	clear();
	console.log(`${chalk.green(`Generating Library : ${answers.name}`)}

${chalk.cyan(`Using Package Manager : ${answers.manager}`)}
${chalk.cyan(`Using Type System : ${answers.typeSystem}`)}
${chalk.cyan(`Using Documentation System : ${answers.documentation}`)}
${chalk.cyan(`Using Style System : ${answers.style}`)}
${chalk.cyan(`Using LICENSE : ${answers.license}`)}`);
	// author info for LICENSE
	answers.year = new Date().getFullYear();
	if (answers.author) {
		answers.authorInfo = `${answers.author} ${
			answers.email ? `(${answers.email})` : ''
		}`;
	}
	console.info(chalk.cyan('Setting up Boilerplate...'));
	const templateStatus = await generateTemplate(answers, root, program.verbose);
	if (templateStatus) {
		clear();
		console.log(
			chalk.blue(
				figlet.textSync(figletText, {
					font: 'Roman',
					horizontalLayout: 'full',
					verticalLayout: 'default',
				})
			)
		);
		console.log(
			chalk.green(
				`Your package "${packageName}" successfully created at ${root}.`
			)
		);
	} else {
		console.error(chalk.red(`Error in creating package "${packageName}"`));
	}
};

#!/usr/bin/env node
'use strict';

const commander = require('commander');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const packageJson = require('../package.json');
const main = require('./main');
const { figletText } = require('./utils');
const {
	PACKAGE_MANAGER,
	TYPE_SYSTEM,
	DOCUMENTATION,
	STYLE,
} = require('./query');

const programeName = 'react-lib';

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

let packageName;

const program = new commander.Command(programeName)
	.version(packageJson.version)
	.arguments('<package-name>')
	.usage(`${chalk.green('<package-name>')} [options]`)
	.action((name) => {
		packageName = name;
	})
	.option('--verbose', 'print additional logs')
	.option('--pm <value>', 'Package Manager (npm or yarn)', (value) =>
		PACKAGE_MANAGER.indexOf(value) === -1 ? '' : value
	)
	.option(
		'--type <value>',
		`Type System for project one of ${TYPE_SYSTEM.join(',')}`,
		(value) => (TYPE_SYSTEM.indexOf(value) === -1 ? '' : value),
		'none'
	)
	.option(
		'--doc <value>',
		`Documentation Library one of ${DOCUMENTATION.join(',')}`,
		(value) => (DOCUMENTATION.indexOf(value) === -1 ? '' : value),
		'docz'
	)
	.option(
		'--style <value>',
		`Styling Library one of ${STYLE.join(',')}`,
		(value) => (STYLE.indexOf(value) === -1 ? '' : value),
		'inline'
	)
	.option('-l, --license <value>', 'License of Project', 'MIT')
	.option('-s, --skip', 'Skip all question and create project with defaults')
	.allowUnknownOption('')
	.on('--help', () => {
		// TODO CLI Doc
		console.log(`
		\n${chalk.cyan('Node version require >= 8 & npm >= 5')}
		`);
	})
	.parse(process.argv);

main(program, packageName).catch((err) => {
	console.error(err);
	process.exit(1);
});

#!/usr/bin/env node
'use strict';

const commander = require('commander');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const packageJson = require('../package.json');
const main = require('./main');

const programeName = 'react-library';

clear();
console.log(
	chalk.blue(
		figlet.textSync(programeName, {
			font: 'Roman',
			horizontalLayout: 'fitted',
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
	.allowUnknownOption()
	.on('--help', () => {
		// TODO CLI Doc
	})
	.parse(process.argv);

main(program, packageName).catch((err) => {
	console.error(err);
	process.exit(1);
});

#!/usr/bin/env node
'use strict';

const commander = require('commander');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const packageJson = require('../package.json');
const main = require('./main');

clear();
console.log(
	chalk.blue(
		figlet.textSync('react-library', {
			font: 'Roman',
			horizontalLayout: 'fitted',
			verticalLayout: 'default',
		})
	)
);

let packageName;

const program = new commander.Command(packageJson.name)
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

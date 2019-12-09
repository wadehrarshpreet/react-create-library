'use strict';

const CLI = require('clui');
const Conf = require('conf');

const Spinner = CLI.Spinner;

function execShellCommand(cmd, options = {}, logs = true) {
	const exec = require('child_process').spawn;
	const command = cmd.split(' ');
	return new Promise((resolve) => {
		const processData = exec(command[0], command.slice(1), options);
		let stdout = '';
		let stderr = '';
		processData.stdout.on('data', (data) => {
			if (logs) {
				console.log(data.toString());
			}
			stdout += data.toString();
		});
		processData.stderr.on('data', function(data) {
			if (logs) {
				console.log(data.toString());
			}
			stderr += data.toString();
		});
		processData.stdout.on('close', function(data) {
			resolve({ stdout, stderr });
		});
	});
}
module.exports = {
	config: new Conf({ projectName: 'react-create-library' }),
	Spinner,
	execShellCommand,
	figletText: 'react-lib',
};

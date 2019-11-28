const spawn = require('cross-spawn');

const { pkg } = require('./utils');

const peerDependencies = pkg.peerDependencies || {};
const peerDeps = Object.keys(peerDependencies);
const packageNeedForDevelopment = peerDeps.map(
	(name) => `${name}@${peerDependencies[name]}`
);
if (packageNeedForDevelopment.length < 1) {
	console.info('No Peer dependencies found');
	process.exit(0);
}
{{#ifCond manager '===' 'yarn'}}
const result = spawn.sync(
	'yarn',
	['add', ...packageNeedForDevelopment, '-P', '--ignore-scripts'],
	{
		stdio: 'inherit',
	}
);
{{else}}
const result = spawn.sync(
	'npm',
	['install', ...packageNeedForDevelopment, '--no-save', '--ignore-scripts'],
	{
		stdio: 'inherit',
	}
);
{{/ifCond}}

process.exit(result.status);

'use strict';

const which = require('which');

const getGitConfigPath = require('git-config-path');
const parseGitConfig = require('parse-git-config');
const githubUsername = require('github-username');

const { config } = require('./utils');

module.exports = async (program) => {
	const defaults = {
		name: '',
		description: '',
		author: config.get('author', ''),
		email: config.get('email', ''),
		license: program.license || config.get('license', 'MIT'),
		manager: program.pm || config.get('manager', 'npm'),
		style: program.style || config.get('style', 'inline'),
		typeSystem:
			program.type === 'none'
				? 'default'
				: program.type || config.get('typeSystem', 'default'),
		documentation: program.doc || config.get('documentation', 'docz'),
		year: new Date().getFullYear(),
	};

	try {
		if (!config.get('author')) {
			const gitConfigPath = getGitConfigPath('global');
			if (gitConfigPath) {
				const gitConfig = parseGitConfig.sync({ path: gitConfigPath });
				if (gitConfig.github && gitConfig.github.user) {
					defaults.author = gitConfig.github.user;
				} else if (gitConfig.user && gitConfig.user.email) {
					if (gitConfig.user.email) {
						config.set('email', gitConfig.user.email);
					}
					defaults.author = await githubUsername(gitConfig.user.email);
				}
			}
			if (defaults.author) {
				config.set('author', defaults.author);
			}
		}
	} catch (err) {}

	try {
		if (!program.pm) {
			if (which.sync('yarn', { nothrow: true })) {
				defaults.manager = 'yarn';
			}
		}
		config.set('manager', defaults.manager);
	} catch (managerError) {}

	return defaults;
};

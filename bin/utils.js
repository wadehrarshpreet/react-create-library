'use strict';

const CLI = require('clui');
const Conf = require('conf');

const Spinner = CLI.Spinner;

module.exports = {
	config: new Conf({ projectName: '@react/create-library' }),
	Spinner,
};

#!/usr/bin/env node
'use strict';

var currentNodeVersion = process.versions.node;
var nodeMajorVersion = currentNodeVersion.split('.')[0];

if (nodeMajorVersion < 8) {
	console.error(
		'You are running Node ' +
			currentNodeVersion +
			'.\n React-Library requires Node 8+. Please update your Node version.'
	);
	process.exit(1);
}

require('./bin/react-library');

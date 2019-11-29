const path = require('path');
const fs = require('fs');
const Handlebars = require('handlebars');
const mkDir = require('make-dir');
const chalk = require('chalk');
const globby = require('globby');
const { Spinner, execShellCommand } = require('./utils');

// prevent files to pass through handlebars compile
const blackListExtension = ['.png', '.jpg', '.gif', '.svg', '.ico', '.pdf'];

Handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {
	if (v1 === undefined || v2 === undefined) {
		// if(!v1 || !v2 ) {
		return options.inverse(this);
	}
	switch (operator) {
		case '==':
			// eslint-disable-next-line
			return v1 == v2 ? options.fn(this) : options.inverse(this);
		case '===':
			return v1 === v2 ? options.fn(this) : options.inverse(this);
		case '!==':
			return v1 !== v2 ? options.fn(this) : options.inverse(this);
		case '!=':
			// eslint-disable-next-line
			return v1 != v2 ? options.fn(this) : options.inverse(this);
		case '<':
			return v1 < v2 ? options.fn(this) : options.inverse(this);
		case '<=':
			return v1 <= v2 ? options.fn(this) : options.inverse(this);
		case '>':
			return v1 > v2 ? options.fn(this) : options.inverse(this);
		case '>=':
			return v1 >= v2 ? options.fn(this) : options.inverse(this);
		case '&&':
			return v1 && v2 ? options.fn(this) : options.inverse(this);
		case '||':
			return v1 || v2 ? options.fn(this) : options.inverse(this);
		default:
			return options.inverse(this);
	}
});

function findRoot(defaultPath = __dirname) {
	let isRoot = path.resolve(defaultPath);
	const files = fs.readdirSync(path.resolve(defaultPath));
	if (files.indexOf('package.json') === -1) {
		isRoot = findRoot(path.resolve(isRoot, '..'));
	}
	return isRoot;
}

const directories = {
	default: 'default',
	documentation: 'DOCUMENTATION',
	typeSystem: 'TYPESYSTEM',
	license: 'LICENSE',
};

const compileAndCopyTemplateFiles = (params, options) => {
	const { files, outputDir, templateDirectoryPath } = options;
	files.forEach(async (filePath) => {
		const destinationPath = path.resolve(
			outputDir,
			path.relative(templateDirectoryPath, filePath)
		);
		const destinationPathDir = path.parse(destinationPath).dir;
		await mkDir(destinationPathDir);
		const fileName = path.basename(destinationPath);
		try {
			console.log(`Copying...${fileName} to ${destinationPath}`);
			if (fileName.match(new RegExp(blackListExtension.join('|'), 'gi'))) {
				// make direct copy
				fs.copyFileSync(filePath, destinationPath);
			} else {
				// compile and generate file
				const template = Handlebars.compile(fs.readFileSync(filePath, 'utf8'));
				const content = template(params);
				fs.writeFileSync(destinationPath, content, 'utf8');
				// prettify the write file
			}
		} catch (e) {
			console.info(chalk.red(`Error in copying file ${fileName} `, e));
			// failed
		}
		// compile template file using handlebars
	});
};

module.exports = async (params, outputDir) => {
	const rootTemplatePath = path.resolve(findRoot(), 'template');
	// create output directory
	const loader = new Spinner(`Creating package ${params.name}`);
	loader.start();
	await mkDir(outputDir);
	// get all Files to generate template
	loader.message('Setting up your package...');
	Object.keys(directories).forEach(async (templateDirectory) => {
		let relativePath = '';
		if (templateDirectory !== 'default') {
			relativePath = `${params[templateDirectory]}`;
		}
		console.log(relativePath);
		const templateDirectoryPath = path.resolve(
			rootTemplatePath,
			directories[templateDirectory],
			relativePath
		);
		const files = await globby(templateDirectoryPath, {
			dot: true,
		});
		if (files && files.length > 0) {
			console.log(path.relative(templateDirectoryPath, files[0]));
			compileAndCopyTemplateFiles(params, {
				files,
				outputDir,
				templateDirectoryPath,
			});
		}
	});
	loader.stop();
	loader.message('Installing Dependencies...');
	loader.start();
	// Installing Package Dependencies
	await execShellCommand(
		`${params.manager} install`,
		{
			cwd: outputDir,
		},
		false
	);
	loader.message('Setting up Example...');
	// Installling Example Dependencies
	await execShellCommand(`${params.manager} install`, {
		cwd: path.resolve(outputDir, 'example'),
	});
	loader.message('Initializing Git Repo...');
	await execShellCommand('git init', { cwd: outputDir });
	await execShellCommand('git add .', { cwd: outputDir });
	await execShellCommand(`git commit -m "init:${params.name}@0.0.1"`, {
		cwd: outputDir,
	});
	loader.stop();
	// run npm install / yarn install
};

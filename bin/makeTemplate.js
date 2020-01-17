const path = require('path');
const fs = require('fs');
const Handlebars = require('handlebars');
const mkDir = require('make-dir');
const chalk = require('chalk');
const commandExistsSync = require('command-exists').sync;
const { Spinner, execShellCommand } = require('./utils');

// prevent files to pass through handlebars compile
const blackListExtension = ['.png', '.jpg', '.gif', '.svg', '.ico', '.pdf'];

const walkSync = function(dir, filelist = []) {
	if (!fs.existsSync(dir)) {
		return filelist;
	}
	const files = fs.readdirSync(dir);
	filelist = filelist || [];
	files.forEach(function(file) {
		if (fs.statSync(path.join(dir, file)).isDirectory()) {
			filelist = walkSync(path.join(dir, file), filelist);
		} else {
			filelist.push(path.join(dir, file));
		}
	});
	return filelist;
};

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
	const {
		files,
		outputDir,
		templateDirectoryPath,
		isVerbose = false,
	} = options;
	const failedFile = [];
	files.forEach(async (filePath) => {
		let destinationPath = path.resolve(
			outputDir,
			path.relative(templateDirectoryPath, filePath)
		);
		const destinationPathDir = path.parse(destinationPath).dir;
		await mkDir(destinationPathDir);
		let fileName = path.basename(destinationPath);
		if (
			!destinationPathDir.includes('/example/src') &&
			fileName.includes('.css') &&
			params.style !== 'css'
		) {
			if (params.externalCSS !== true) {
				return;
			}
			fileName = fileName.replace('css', params.style);
		}
		destinationPath = destinationPath.replace(
			path.basename(destinationPath),
			fileName
		);
		try {
			if (isVerbose) {
				console.log(`Copying...${fileName} to ${destinationPath}`);
			}
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
			failedFile.push(fileName);
			// failed
		}
		// compile template file using handlebars
	});
	return failedFile;
};

module.exports = async (params, outputDir, isVerbose = false) => {
	const rootTemplatePath = path.resolve(findRoot(), 'template');
	// create output directory
	const loader = new Spinner(`Creating package ${params.name}`);
	loader.start();
	try {
		await mkDir(outputDir);
	} catch (e) {
		console.error(
			chalk.red(`Error in Creating output directory.\nError: ${e}`)
		);
		return false;
	}
	// get all Files to generate template
	loader.message('Setting up your package...');
	let isCopyFailed = false;
	Object.keys(directories).forEach((templateDirectory) => {
		let relativePath = '';
		if (templateDirectory !== 'default') {
			relativePath = `${params[templateDirectory]}`;
		}
		const templateDirectoryPath = path.resolve(
			rootTemplatePath,
			directories[templateDirectory],
			relativePath
		);
		const files = walkSync(templateDirectoryPath);
		if (files && files.length > 0) {
			const failedFile = compileAndCopyTemplateFiles(params, {
				files,
				outputDir,
				templateDirectoryPath,
				isVerbose,
			});
			if (failedFile.length > 0) {
				isCopyFailed = true;
			}
		}
	});
	if (isCopyFailed) {
		return false;
	}
	loader.stop();
	loader.message('Installing Dependencies...');
	loader.start();
	let manager = params.manager;
	const isWin = process.platform === 'win32';
	if (isWin) {
		manager = `${manager}.cmd`;
	}
	// Installing Package Dependencies
	try {
		await execShellCommand(
			`${manager} install`,
			{
				cwd: outputDir,
			},
			isVerbose
		);
		// loader.message('Installing Peer Dependencies');
		await execShellCommand(
			`${manager} run build`,
			{
				cwd: outputDir,
			},
			isVerbose
		);
		loader.message('Setting up Example...');
		// Installling Example Dependencies
		await execShellCommand(
			`${manager} install`,
			{
				cwd: path.resolve(outputDir, 'example'),
			},
			isVerbose
		);
	} catch (e) {
		console.error(chalk.red(`Error in Installing Dependencies.\nError: ${e}`));
	}

	if (commandExistsSync('git')) {
		loader.message('Initializing Git Repo...');
		try {
			await execShellCommand('git init', { cwd: outputDir }, false);
			const gitIgnorePath = path.join(outputDir, '.gitignore');
			fs.writeFileSync(
				gitIgnorePath,
				`# See https://help.github.com/ignore-files/ for more about ignoring files.

# dependencies
node_modules

# builds
build
dist
.rpt2_cache

#docs
.docz
docs


# misc
.editorconfig
.gitattributes
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
`,
				'utf8'
			);
			await execShellCommand('git add .', { cwd: outputDir }, false);
			await execShellCommand(
				`git commit -m "init:${params.name}@0.0.1"`,
				{
					cwd: outputDir,
				},
				false
			);
		} catch (e) {
			console.error(chalk.red(`Error in Initializing Git Repo.\nError: ${e}`));
		}
	}
	loader.stop();
	return true;
};

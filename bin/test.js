// Testing every possible build
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const mkDir = require('make-dir');
const path = require('path');

const testProjectName = 'project-test';
const testProjectDirectory = 'test';

const {
	PACKAGE_MANAGER,
	TYPE_SYSTEM,
	DOCUMENTATION,
	STYLE,
} = require('./query');

const cwd = path.join(__dirname, testProjectDirectory);

const totalTest =
	PACKAGE_MANAGER.length *
	TYPE_SYSTEM.length *
	DOCUMENTATION.length *
	STYLE.length;
let testPass = 0;
let testFailed = 0;
let testIndex = 0;

(async () => {
	try {
		await exec(`rm -rf ${testProjectDirectory}`, { cwd: __dirname });
		mkDir(cwd);
	} catch (e) {
		// e
		console.log('Error in creating test folder ', e);
		process.exit(1);
	}
	const testCases = [];
	PACKAGE_MANAGER.forEach((manager) => {
		TYPE_SYSTEM.forEach((type) => {
			DOCUMENTATION.forEach((doc) => {
				STYLE.forEach(async (style) => {
					const projectName = `${testProjectName}-${manager}-${type}-${doc}-${style}`;
					testCases.push({
						projectName,
						cmd: `node ${path.join(
							__dirname,
							'react-lib.js'
						)} ${projectName} --pm ${manager} --type ${type} --doc ${doc} --style ${style} -s`,
						manager,
						type,
						doc,
						style,
					});
				});
			});
		});
	});
	for (let i = 0; i < testCases.length; i++) {
		const test = testCases[i];
		testIndex++;
		const { projectName, cmd, doc } = test;
		console.log(`Running ${testIndex}/${totalTest}`);
		console.log(`Generating project ${projectName}`);
		try {
			await exec(cmd, { cwd });
			const { stderr: testErr } = await exec(
				'npm run test -- --json --silent',
				{
					cwd: path.join(cwd, projectName),
				}
			);
			console.log('Running Test...');
			if (testErr.substr(0, 4) !== 'PASS') {
				console.log('testErr ', testErr, ' - ', projectName);
				process.exit(1);
			} else {
				console.log('test Pass ', testErr);
			}

			console.log('Testing Example');
			const { stdout: exampleTest, stderr: exampleErr } = await exec(
				'npm run build',
				{
					cwd: path.join(cwd, projectName, 'example'),
				}
			);
			if (exampleErr) {
				console.log('exampleErr ', exampleErr, ' - ', projectName);
				process.exit(1);
			} else {
				console.log('exampleTest ', exampleTest);
			}

			if (doc !== 'none') {
				console.log('Testing Documentation');
				const { stdout: docTest, stderr: docErr } = await exec(
					'npm run doc:build',
					{
						cwd: path.join(cwd, projectName),
					}
				);
				if (docErr) {
					console.log('docErr ', docErr, ' - ', projectName);
					process.exit(1);
				} else {
					console.log('docTest ', docTest);
				}
			}
			await exec(`rm -rf ${path.join(cwd, projectName)}`);
			testPass++;
		} catch (e) {
			testFailed++;
		}
	}
	console.log('Test Passed :', testPass);
	console.log('Test Failed :', testFailed);
})();

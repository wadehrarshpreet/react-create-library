const util = require('util');
const exec = util.promisify(require('child_process').exec);

const testProjectName = 'project-test';

const {
	PACKAGE_MANAGER,
	TYPE_SYSTEM,
	DOCUMENTATION,
	STYLE,
} = require('./query');


const totalTest =
	PACKAGE_MANAGER.length *
	TYPE_SYSTEM.length *
	DOCUMENTATION.length *
	STYLE.length;
let testPass = 0;
let testIndex = 0;

PACKAGE_MANAGER.forEach((manager) => {
	TYPE_SYSTEM.forEach((type) => {
		DOCUMENTATION.forEach((doc) => {
			STYLE.forEach(async (style) => {
				testIndex++;
				console.log(`Running ${testIndex}/${totalTest}`);
				const projectName = `${testProjectName}-${manager}-${type}-${doc}-${style}`;
				const { stdout, stderr } = await exec(
					`react-library ${projectName} --pm ${manager} --type ${type} --doc ${doc} --style ${style} -s`
				);
				console.log('stdout ', stdout);
				console.log('stderr ', stderr);
				process.exit(1);
			});
		});
	});
});

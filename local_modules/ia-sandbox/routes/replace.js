const doT = require('dot');
const fs = require('fs');
const path = require('path');

const LINE_JUMP = 'LJ';

module.exports = (req, res, next) => {
	let isModuleCss = false;

	if(req.originalUrl.indexOf('.css') !== -1) {

		let modules = fs.readdirSync(process.env.MODULE_PATH);

		modules.forEach((file) => {
			let fileNameMatch = req.originalUrl.match(/(([^\/]*)\.css)$/);
			if(fileNameMatch && fileNameMatch.length > 2) {
				let fileName = fileNameMatch[1];
				let moduleName = fileNameMatch[2];
				if(file === moduleName) {
					isModuleCss = true;
					let filePath = path.join(process.env.MODULE_PATH, moduleName, 'public', 'css', fileName);

					fs.readFile(filePath, 'utf8', (err, fd) => {
						if(err) {
							next({status : 500, message : err.toString()});
							return
						}
						let dotContent = fd.replace(/\n/g, LINE_JUMP);
						let cssDotFunction = doT.template(dotContent);
						let css = cssDotFunction({images_path : '../img'});
						res.header("Content-type", "text/css");
						res.send(css.replace(new RegExp(LINE_JUMP, 'g'), '\n'))
					});
				return
				}

			}


		});

	}
	if(false === isModuleCss) {
		next()
	}
};
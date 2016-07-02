import through from 'through2';
import fs from 'fs';

var getName = (name)=> name.match(/node_modules\/inless_dependencies\/([^\/]+)/i)[1];

export const piperStyle = through.obj((file, enc, cb)=> {
	let name = getName(file.path);
	// file._newName = file.path.replace(/[^\/]+\/styles\/index\.less/ig, `tmp_${name}.css`);
	let type = JSON.parse(fs.readFileSync(file.path.replace(/style\.less$/i, 'package.json')).toString())['inless']['type'];
	switch(type) {
		case "ui-kit":
			file.contents = new Buffer(`${file.contents.toString(enc)}\n\n=== ui-kit ===\n\n`);
			cb(null, file);
		break;
		case "component":
			file.contents = new Buffer(`[data-inlessId="${name}"] { ${file.contents.toString(enc)} }`);
			cb(null, file);
		break;
		case "modificator":
			file.contents = new Buffer(`[data-mod~="${name}"] { ${file.contents.toString(enc)} }`);
			cb(null, file);
		break;
		default:
			cb();
	}
});

export const rename = through.obj((file, enc, cb)=> {
	file.path = file._newName;
	cb(null, file);
});



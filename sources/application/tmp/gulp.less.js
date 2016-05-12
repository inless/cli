import through from 'through2';
import fs from 'fs';

var getName = (name)=> name.match(/node_modules\/inless_dependencies\/([^\/]+)/i)[1];

export const piperStyle = through.obj((file, enc, cb)=> {
	let name = getName(file.path);
	file._newName = file.path.replace(/[^\/]+\/styles\/index\.less/ig, `tmp_${name}.css`);
	file.contents = new Buffer(`[data-inlessId="${name}"] { ${file.contents.toString(enc)} }`);
	cb(null, file);
});

export const rename = through.obj((file, enc, cb)=> {
	file.path = file._newName;
	cb(null, file);
});


import dl from 'damerau-levenshtein-git';
export default function normalize(args = [], stack = []) {
	let corresponds = [];
	let commands = [];
	if(!args.length) {
		return {
			corresponds,
			commands
		};
	} else {
		var param = stack.map((e)=> {
			var ret = e.aliases.concat([e.command]).map((e)=> {
				var cmd = args[0].toLowerCase();
				if(cmd.length < e.length) {
					cmd += new Array(e.length - cmd.length).fill(' ').join('');
				} else if(cmd.length > e.length) {
					cmd = cmd.substr(0, e.length);
				}
				return (cmd.length / dl(cmd, e) - 1);
			}).reduce((a,b)=> b>a?b:a);
			return Object.assign({
				correspond: ret
			}, e);
		}).reduce((a,b)=> {
			return b.correspond > a.correspond ? b : a;
		});
		corresponds.push(param.correspond);
		commands.push(param.command);
		if(param.childs) {
			let x = normalize(args.slice(1), param.childs);
			corresponds = corresponds.concat(x.corresponds);
			commands = commands.concat(x.commands);
			return {
				corresponds,
				commands
			}
		} else {
			return {
				corresponds,
				commands
			}
		}
	}
}
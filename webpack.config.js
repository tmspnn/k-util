import process from "node:process";

const pwd = process.cwd();

export default {
	mode: "production",
	devtool: false,
	context: pwd + "/src",
	entry: "./kutil.js",
	output: {
		path: pwd + "/dist",
		filename: "kutil.min.js",
		library: {
			name: "kutil",
			type: "var",
			export: "default"
		},
		globalObject: "this"
	},
	module: {
		rules: []
	}
};

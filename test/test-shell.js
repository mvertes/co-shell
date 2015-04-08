#!/usr/bin/env node

var spawn = require('child_process').spawn;

var copro = spawn('node', ['--harmony', 'bin/co-shell']);
var prompt = "co-shell> ";
var script = [
	['a = 1', '1'],
	['var thenify = require("thenify")', 'undefined'],
	['var readFile = thenify(require("fs").readFile)', 'undefined'],
	['var data = yield readFile("index.js")', 'undefined'],
	['data.length > 100', 'true']
];
var n = 0;
var waitPrompt = true;

copro.on('exit', function (code, signal) {
	console.log(copro.spawnfile + " exited with code " + code);
	process.exit(1);
});

copro.stdout.on('data', function (data) {
	var stop = 0;
	var lines = data.toString().split(/\r\n|\r|\n/);
	for (var i in lines) {
		if (! lines[i]) continue;
		if (waitPrompt) {
			if (lines[i] === prompt) {
				if (n >= script.length) process.exit(0);
				console.log("# sending " + script[n][0]);
				copro.stdin.write(script[n][0] + "\n");
			} else {
				console.log('# Expect "' + prompt + '", got "' + lines[i] + '"');
				process.exit(1);
			}
			waitPrompt = false;
		} else {
			console.log('# Expect "' + script[n][1] + '", got "' + lines[i] + '"');
			if (lines[i] === script[n][1]) {
				n++;
				waitPrompt = true;
			} else {
				console.log('# Send "' + script[n][0] + '"');
				console.log('# Expect "' + script[n][1] + '", got "' + lines[i] + '"');
				process.exit(1);
			}
		}
	}
});

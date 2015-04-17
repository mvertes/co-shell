'use strict';

var repl = require('repl');
var co = require('co');

function corepl(cli) {
  var originalEval = cli.eval;

  cli.eval = function coEval(cmd, context, filename, callback) {
    if (cmd.match(/\W*yield\s+/))
      cmd = 'co(function *() {' + cmd.replace(/^\s*var\s+/, '') + '});';

    originalEval.call(cli, cmd, context, filename, function(err, res) {
      if (err || !res || typeof res.then !== 'function')
        return callback(err, res);
      res.then(done, callback);
    });

	function done(val) {
	  callback(null, val);
	}
  };

  return cli;
}

module.exports = function coshell(opt) {
  var s = corepl(repl.start(opt || {}));
  s.context.co = co;
  return s;
};

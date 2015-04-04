'use strict';

var repl = require('repl');
var co = require('co');

function corepl(cli) {
  var eval2 = cli.eval;

  cli.eval = function(cmd, context, filename, callback) {
    if (cmd.match(/\W*yield\s+/))
      cmd = 'co(function *() {' + cmd.replace(/^\s*var\s+/, '') + '});';
    eval2.call(cli, cmd, context, filename, function(err, res) {
      if (err || !res || typeof res.then !== 'function')
        return callback(err, res);
      res.then(function(val) {callback(null, val);}, callback);
    });
  };

  return cli;
}

module.exports = function(opt) {
  var s = corepl(repl.start(opt || {}));
  s.context.co = co;
  return s;
}

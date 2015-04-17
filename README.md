# co-shell

[![Build Status](https://travis-ci.org/mvertes/co-shell.svg?branch=master)](https://travis-ci.org/mvertes/co-shell)

Extend node.js core [REPL](https://nodejs.org/api/repl.html) module
to support promises, [co](https://github.com/tj/co) and `yield` statements.

Both executable and module for use in programs are provided.

## Install
```
$ npm install [-g] co-shell
```

## Usage
Install some promized stuff, for example [mz](https://github.com/normalize/mz):

```
$ npm install mz
```

Then run the provided `bin/co-shell` executable.
Adjust first line `#!/usr/local/bin/node --harmony` if necessary.

```js
$ co-shell
co-shell> fs = require('mz/fs')
co-shell> a = yield fs.readFile('/etc/hosts', 'utf-8')
co-shell> console.log(a)
```

## API

Using `co-shell` in a program is quite simple. Lets build a shell
as above, enabling access to `mz/fs`:

```js
var coshell = require('co-shell');
var context = coshell({prompt: 'co-shell> '}).context;

context.fs = require('mz/fs');
```

`coshell(options)` has exactly the same syntax as `repl.start(options)`
in core [REPL](https://nodejs.org/api/repl.html). Please refer
to the original documentation for further details.

## License

[MIT license](./LICENSE).

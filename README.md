# cat.js

[![Latest version](https://img.shields.io/npm/v/@unixcompat/cat.js)
 ![Dependency status](https://img.shields.io/librariesio/release/npm/@unixcompat/cat.js)
](https://www.npmjs.com/package/@unixcompat/cat.js)
[![Coverage](https://codecov.io/gh/prantlf/cat.js/branch/master/graph/badge.svg)](https://codecov.io/gh/prantlf/cat.js)

Concatenates and prints files on the standard output like the `cat` command.

There are multi-platform file-system commands compatible with `cat` from UN*X implemented for Node.js in JavaScript, like [cat], but they have a different interface and a different behaviour than the `cat` command. Instead of reusing the knowledge of the `cat` command, you would have to learn their new interface. This project aims to provide the well-known interface of the `cat` command.

This package offers only command-line interface, because programmatic interface is provided by methods from [node:fs]. See also other commands compatible with their counterparts from UN*X - [rm.js], [cp.js], [mkdir.js] and [mv.js].

## Synopsis

The following scripts from `package.json` won't work on Windows:

    rm -rf dist
    mkdir -p dist
    cat src/umd-prolog.txt src/code.js src/umd-epilog.txt > dist/index.umd.js
    cp src/index.d.ts dist
    mv LICENSE doc

Replace them with the following ones, which run on any operating system which is supported by Node.js:

    rm.js -rf dist
    mkdir.js -p dist
    cat.js src/umd-prolog.txt src/code.js src/umd-epilog.txt > dist/index.umd.js
    cp.js src/index.d.ts dist
    mv.js LICENSE doc

Notice that the only difference is the suffix `.js` behind the command names.

## Installation

This module can be installed in your project using [NPM], [PNPM] or [Yarn]. Make sure, that you use [Node.js] version 16 or newer.

```sh
$ npm i -D @unixcompat/cat.js
$ pnpm i -D @unixcompat/cat.js
$ yarn add -D @unixcompat/cat.js
```

## Command-line Interface

See also `man cat` for the original [POSIX documentation] or for the extended [Linux implementation].

    Usage: cat.js [-AbeElnstTuv] [--] file...

    Options:
      -A|--show-all          equivalent to -vET
      -b|--number-nonblank   number the non-blank output lines, starting at 1
      -e|--show-np-and-ends  equivalent to -vE
      -E|--show-ends         display a dollar sign ("$") at the end of each line
      -l|--lock              set an exclusive advisory lock on standard output;
                             if the output file is already locked, this command
                             will block until the lock is acquired
      -n|--number            number all output lines, starting at 1
      -s|--squeeze-blank     squeeze adjacent empty lines to a single one
      -t|--show-np-and-tabs  equivalent to -vT
      -T|--show-tabs         display TAB characters as "^I"
      -u|--unbuffering       ignored (originally disable output buffering)
      -v|--show-nonprinting  display non-printing characters so they are visible;
                             control characters as "^X", DEL character as "^?",
                             non-ASCII characters as "M-" and the ASCII character
      -V|--version           print version number
      -h|--help              print usage instructions

      If file is a single dash ("-") or absent, the standard input will be used.

    Examples:
      $ cat.js a
      $ cat.js -s /tmp/a /tmp/b > /tmp/c

## Differences

The following options from the POSIX version are not supported, but they are accepted and ignored:

    -u    write bytes from the input file to the standard output without delay
          as each is read

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.  Add unit tests for any new or changed functionality. Lint and test your code using `npm test`.

## License

Copyright (c) 2023 Ferdinand Prantl

Licensed under the MIT license.

[Node.js]: http://nodejs.org/
[NPM]: https://www.npmjs.com/
[PNPM]: https://pnpm.io/
[Yarn]: https://yarnpkg.com/
[cat]: https://www.npmjs.com/package/cat
[del-cli]: https://www.npmjs.com/package/del-cli
[del]: https://www.npmjs.com/package/del
[rm.js]: https://www.npmjs.com/package/@unixcompat/rm.js
[cp.js]: https://www.npmjs.com/package/@unixcompat/cp.js
[mkdir.js]: https://www.npmjs.com/package/@unixcompat/mkdir.js
[mv.js]: https://www.npmjs.com/package/@unixcompat/mv.js
[POSIX documentation]: https://man7.org/linux/man-pages/man1/cat.1p.html
[Linux implementation]: https://man7.org/linux/man-pages/man1/cat.1.html
[node:fs]: https://nodejs.org/api/fs.html

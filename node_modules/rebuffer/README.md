# rebuffer

A transform stream that buffers internally and emits chunks of given length.

[![NPM Package](https://img.shields.io/npm/v/rebuffer.svg?style=flat)](https://www.npmjs.org/package/rebuffer)
[![Build Status](https://travis-ci.org/seedalpha/rebuffer.svg?branch=master)](https://travis-ci.org/seedalpha/rebuffer/branches)
[![Dependencies](https://david-dm.org/seedalpha/rebuffer.svg)](https://david-dm.org/seedalpha/rebuffer)

### Installation

    $ npm install rebuffer --save

### Usage

```javascript
var rebuffer = require('rebuffer');

fs.readReadStream('bigfile.txt')
  .pipe(rebuffer(1024 * 1024)) // will buffer input chunks, and emit 1mb chunks out
  .pipe(fs.createWriteStream('foo.txt'));

```

### Author

Vladimir Popov <rusintez@gmail.com>

### License

MIT
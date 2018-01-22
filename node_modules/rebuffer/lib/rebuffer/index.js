/**
 * Module dependencies
 */

var Buffers = require('buffers');
var through = require('through2');

/**
 * re-buffer stream to specified chunk length 
 *
 * @param {Number} length
 * @return {Transform} stream
 */

function rebuffer(len) {
  var buffers = new Buffers();
  return through(function(chunk, enc, done) {
    buffers.push(chunk);
    while (buffers.length >= len) {
      this.push(buffers.splice(0, len).toBuffer());
    }
    done();
  }, function(done) {
    if (buffers.length) {
      this.push(buffers.slice());
    }
    done();
  });
}

/**
 * Expose
 */

exports = module.exports = rebuffer;
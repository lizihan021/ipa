var stream = require("stream");
var rebuffer = require('..');
var through = require('through2');
var assert = require('assert');
var bt = require('buffertools');
var buf = new Buffer(1001);

describe('rebuffer', function() {
  
  before(function() {
    this.stream = new stream.Transform();
  });
  
  it('should re-emit buffers of specified length', function(done) {
    var count = 0;
    var tmp = [];
    this.stream.pipe(rebuffer(10)).pipe(through(function(chunk, enc, cb) {
      tmp.push(chunk);
      count++;
      cb();
    }, function(cb) {
      assert.equal(count, Math.floor(buf.length / 10) + 1);
      assert(bt.equals(Buffer.concat(tmp), buf));
      cb();
      done();
    }));
    this.stream.push(buf);
    this.stream.push(null);
  });
});


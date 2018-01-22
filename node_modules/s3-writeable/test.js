var assert = require('assert');
var fs = require('fs');
var aws = require('aws-sdk');
var writeable = require('./');
var readable = require('s3-readable');

aws.config.update({
  accessKeyId:      process.env.AMAZON_ACCESS_KEY_ID,
  secretAccessKey:  process.env.AMAZON_ACCESS_KEY_SECRET,
  region:           process.env.S3_REGION
});

var s3 = new aws.S3();

describe('s3-writeable', function() {
  it('should create a writeable stream', function(done) {
    fs.createReadStream(__dirname + '/test.js')
      .pipe(writeable(s3).createWriteStream({
        Bucket: process.env.S3_BUCKET,
        Key: 'test.js'
      }))
      .on('end', function() {
        readable(s3).createReadStream({
          Bucket: process.env.S3_BUCKET,
          Key: 'test.js'
        })
        .pipe(fs.createWriteStream(__dirname + '/.test.js'))
        .on('finish', function() {
          assert.equal(
            fs.readFileSync(__dirname + '/test.js').toString(),
            fs.readFileSync(__dirname + '/.test.js').toString()
          );
          fs.unlinkSync(__dirname + '/.test.js');
          done();
        });
      });
  });
});
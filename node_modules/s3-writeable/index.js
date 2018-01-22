/**
 * Module dependencies
 */

var rebuffer  = require('rebuffer');
var through   = require('through2');
var debug     = require('debug')('s3-streams');
var throughout = require('throughout');
var head      = require('head-stream');

/**
 * s3-writeable
 *
 * @param {Object} s3client
 * @param {Object} options
 *   @param {Number} size, default 5Mb
 *   @param {Number} maxRetries, default 5
 * @return {Object}
 *   @param {Function} createWriteStream(params)
 */

exports = module.exports = function writeable(s3, options) {
  options = options || {};
  options.size = options.size || 1024 * 1024 * 5;
  options.maxRetries = options.maxRetries || 5;
  
  return {
    createWriteStream: function(params) {
      var count   = 0;
      var parts   = [];
      var mp      = null
      
      var start = through(function(chunk, enc, done) {
        if (mp) return done(null, chunk);
        s3.createMultipartUpload(params, function(err, response) {
          if (err) return done(err);
          mp = response;
          done(null, chunk);
        });
      });
      // function start(buffer, done) {
      //   s3.createMultipartUpload(params, function(err, response) {
      //     if (err) return done(err);
      //     mp = response;
      //     done();
      //   });
      // }
      
      function upload(part, retry, done) {
        var retry = retry || 0;
        s3.uploadPart(part, function(err, res) {
          if (err) {
            debug(err);
            if (retry < options.maxRetries) {
              upload(part, ++retry, done);
            } else {
              done('Max retries reached');
            }
            return;
          }
          parts.push({
            ETag: res.ETag,
            PartNumber: parseInt(this.request.params.PartNumber, 10)
          });
          done();
        });
      }
      
      var multipart = through(function (chunk, enc, done) {
        upload({
          UploadId:   mp.UploadId,
          PartNumber: ++count,
          Bucket:     params.Bucket,
          Key:        params.Key,
          Body:       chunk
        }, 0, done);
      }, function(done) {
        s3.completeMultipartUpload({
          UploadId:   mp.UploadId,
          Bucket:     params.Bucket,
          Key:        params.Key,
          MultipartUpload:  {
					  Parts: parts
				  }
        }, function(err, res) {
          if (err) return done(err);
          done();
        });
      });
      
      // return throughout(rebuffer(options.size), throughout(head(start, { includeHead: true }), multipart));
      return throughout(rebuffer(options.size), throughout(start, multipart));
    }
  }
}
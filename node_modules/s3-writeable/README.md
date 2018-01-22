# s3-writeable

Write to S3 using streams (via multipart upload)

[![NPM Package](https://img.shields.io/npm/v/s3-writeable.svg?style=flat)](https://www.npmjs.org/package/s3-writeable)
[![Dependencies](https://david-dm.org/seedalpha/s3-writeable.svg)](https://david-dm.org/seedalpha/s3-writeable)

### Installation

    $ npm install s3-writeable --save
    
### Usage

```javascript

var fs = require('fs');
var aws = require('aws-sdk');
var writeable = require('s3-writeable');

aws.config.update({
  accessKeyId:      process.env.AMAZON_ACCESS_KEY_ID,
  secretAccessKey:  process.env.AMAZON_ACCESS_KEY_SECRET,
  region:           process.env.S3_REGION
});

var s3 = new aws.S3();

var stream = writeable(s3).createWriteStream({
  Bucket: 'test',
  Key: 'file.pdf'
  // takes same params as `s3.createMultipartUpload`
});

fs.createReadStream(__dirname + '/file.pdf')
  .pipe(stream)
  .on('error', function(err) {})
  .on('end', function() {
    // all done
  });

```

### Author

Vladimir Popov <rusintez@gmail.com>

### License

MIT
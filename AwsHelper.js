const AWS = require('aws-sdk');
const fs = require('fs');
var config = {
  "accessKeyId": "",
  "secretAccessKey": "",
  "region": "",
  "maxRetries": 3
};
AWS.config.update(config);
var s3 = new AWS.S3({ apiVersion: '2006-03-01' });
function upload(fileName,filePath) {
    return new Promise((resolve, reject) => {
        try {
            var uploadParams = {
              Bucket: "bucketName",
              Key: "foldername" ,
              Body: ''
            };
            var fileStream = fs.createReadStream(filePath);
            fileStream.on('error', function (err) {
                console.error('File Error', err);
            });
            uploadParams.Body = fileStream;
            s3.upload(uploadParams, function (err, data) {
                if (err) {
                    console.error("Error", err);
                    reject(err);
                }
                if (data) {
                    resolve(data.Location);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}
function download(fileName, filePath, bucket, cb) {
  try {
    var downloadParams = {
      Bucket: "bucketName",
      Key: "foldername" 
    };
    s3.getObject(downloadParams, function (err, data) {
      if (err) {
        console.error("Error", err);
        cb(err, null);
      }
      if (data) {
        fs.writeFile(filePath, data.Body, "binary", function (err) {
          if (err) {
            console.error(err);
            cb(err, null);
          } else {
            cb(null, data);
          }
        });
      }
    });
  } catch (e) {
    cb("Download failed", null);
  }
}


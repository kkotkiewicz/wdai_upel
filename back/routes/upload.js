var express = require('express');
var router = express.Router();
const { S3Client, PutObjectCommand } = require ('@aws-sdk/client-s3');
require('dotenv').config()

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage})

const bucketName = process.env.S3_BUCKET_NAME
const bucketRegion = process.env.S3_BUCKET_REGION
const accessKey = process.env.S3_ACCESS_KEY
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY

const s3Client = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    }
})

router.post('/', upload.single('file'), function(req, res){
    //console.log("req.body", req.body);
    //console.log("req.file", req.file);
    req.file.buffer
    const extention = req.file.originalname.split('.').pop();
    const fileName = Date.now() + '.' + extention;
    const link = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`;

    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: req.file.buffer,
        ACL: 'public-read',
        ContentType: req.file.mimetype,
    }

    const command = new PutObjectCommand(params);

    s3Client.send(command)
    res.json({link});
})

module.exports = router;
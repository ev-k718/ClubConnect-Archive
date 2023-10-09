import crypto from 'crypto';

const bootstrapFile = (file: any, Bucket: string) => {
  const fileSize = file.size / 1000;

  const fileSizeInMB = fileSize / 1000;

  const key = crypto.randomBytes(32).toString('hex');

  const [, extension] = file.originalname.split('.');
  const s3UploadParams = {
    Bucket,
    Key: `${key}.${extension}`,
    Body: file.buffer,
    ContentDisposition: 'inline',
    ContentType: file.mimetype,
  };

  return { s3UploadParams, key, fileSizeInMB, fileSize, extension };
};

export default bootstrapFile;

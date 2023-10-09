import aws from 'aws-sdk';
import { Router } from 'express';
import multer from 'multer';
import prisma from '../../prisma/client';

import ApiError from '../../model/ApiError';
import bootstrapFile from '../util/s3UploadHelper';

const router = Router();
const endpoint = '/s3FileStorage';
const hourInSeconds = 60 * 60;

const upload = multer({ storage: multer.memoryStorage() });
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

router.post(
  `${endpoint}/upload/:applicationSubmissionId/:questionId`,
  upload.single('file'),
  async (req, res, next) => {
    try {
      const { file } = req;
      const { applicationSubmissionId, questionId } = req.params;
      const { id: userId } = req.user;
      console.log(req.params);
      if (file && file.mimetype !== 'application/pdf') {
        throw new ApiError(400, 'File must be a PDF');
      }

      const { s3UploadParams, key, fileSize, fileSizeInMB, extension } =
        bootstrapFile(req.file, process.env.AWS_BUCKET_NAME as string);

      const s3 = new aws.S3();
      s3.upload(s3UploadParams, async (err: any) => {
        if (err) {
          console.log(err);
          throw new ApiError(500, 'Error uploading file to S3');
        }

        const url = s3.getSignedUrl('getObject', {
          Bucket: process.env.AWS_BUCKET_NAME as string,
          Key: file?.originalname,
          Expires: hourInSeconds,
        });
        const keyForDB = `${key}.${extension}`;
        await prisma.answer.upsert({
          // Checks if the answer already exists
          where: {
            applicationSubmissionId_questionId: {
              applicationSubmissionId: applicationSubmissionId as string,
              questionId: questionId as string,
            },
          },

          // If the answer exists, update it
          update: {
            value: keyForDB,
            filename: file?.originalname,
          },

          // If the answer doesn't exist, create it
          create: {
            value: keyForDB,
            filename: file?.originalname,
            questionId: questionId as string,
            userId,
            applicationSubmissionId: applicationSubmissionId as string,
          },
        });

        return res.status(200).json({
          message: 'File uploaded successfully',
          key: keyForDB,
          fileSize,
          fileSizeInMB,
          url,
        });
      });
    } catch (err) {
      next(err);
    }
  },
);

router.get(`${endpoint}/getFile`, async (req, res, next) => {
  try {
    const { key } = req.query;

    const s3 = new aws.S3();
    const fileUrl = s3.getSignedUrl('getObject', {
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: key,
      Expires: hourInSeconds,
    });

    return res.status(200).json({
      message: 'File link retrieved successfully',
      fileUrl,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

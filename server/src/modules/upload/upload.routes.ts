import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { uploadImage, uploadMultipleImages, deleteImage } from './upload.controller';
import { authenticate } from '../../common/middleware/auth.middleware';
import { authorize } from '../../common/middleware/roles.middleware';
import { upload } from '../../common/utils/upload.util';

const uploadRouter = Router();

uploadRouter.post(
  '/image',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  upload.single('image'),
  uploadImage
);

uploadRouter.post(
  '/images',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  upload.array('images', 10),
  uploadMultipleImages
);

uploadRouter.delete(
  '/image',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  deleteImage
);

export { uploadRouter };

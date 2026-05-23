import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/async-handler.util';
import { AppError } from '../../common/utils/app-error.util';
import fs from 'fs/promises';
import path from 'path';

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  res.status(201).json({
    success: true,
    data: {
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    },
    message: 'Image uploaded successfully',
  });
});

export const uploadMultipleImages = asyncHandler(async (req: Request, res: Response) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    throw new AppError('No files uploaded', 400);
  }

  const files = req.files.map((file) => ({
    url: `/uploads/${file.filename}`,
    filename: file.filename,
    size: file.size,
    mimetype: file.mimetype,
  }));

  res.status(201).json({
    success: true,
    data: files,
    message: `${files.length} images uploaded successfully`,
  });
});

export const deleteImage = asyncHandler(async (req: Request, res: Response) => {
  const { filename } = req.body;

  if (!filename) {
    throw new AppError('Filename is required', 400);
  }

  const filePath = path.join(process.cwd(), 'uploads', filename);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    throw new AppError('File not found or already deleted', 404);
  }

  res.json({
    success: true,
    message: 'Image deleted successfully',
  });
});

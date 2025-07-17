import path from 'node:path';
import fs from 'node:fs/promises';
import sharp from 'sharp';
import createHttpError from 'http-errors';

export const validateUploadedFile = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) return next();

    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext) && mime.startsWith('image/')) {
      const resizedPath = `${file.path}-resized${ext}`;
      await sharp(file.path)
        .resize({ width: 320, height: 240, fit: 'inside' })
        .toFile(resizedPath);

      await fs.unlink(file.path);
      req.file.path = resizedPath;
      req.file.filename = path.basename(resizedPath);
    } else if (ext === '.txt' && mime === 'text/plain') {
      const stats = await fs.stat(file.path);
      if (stats.size > 102400) {
        await fs.unlink(file.path);
        throw new createHttpError.BadRequest('Text file must be under 100 KB.');
      }
    } else {
      await fs.unlink(file.path);
      throw new createHttpError.BadRequest('Invalid image file');
    }

    next();
  } catch (err) {
    next(err);
  }
};

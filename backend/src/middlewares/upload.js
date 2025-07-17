import path from 'node:path';

import createHttpError from 'http-errors';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('src', 'tmp'));
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + '-' + file.originalname);
  },
});

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.txt'];
const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'text/plain',
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(mime)) {
    cb(null, true);
  } else {
    cb(new createHttpError.BadRequest('Only JPG, PNG, GIF, or TXT files are allowed.'));
  }
};


export const upload = multer({
  storage,
  fileFilter,
});

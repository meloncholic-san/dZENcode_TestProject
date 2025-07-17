import createHttpError from 'http-errors';
import { createMessage, getAllMessages } from '../services/message.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { uploadToCloudinary } from '../utils/uploadToClaudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export const createMessageCtrl = async (req, res, next) => {
  try {
    const { text, homepage, parentId, name, email } = req.body;


    if (!text && !req.file) {
      throw new createHttpError.BadRequest('Message must have text or a file');
    }

    let fileUrl = null;
    let fileType = null;

    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();

      if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
        fileType = 'image';
      } else if (ext === '.txt') {
        fileType = 'text';
      }

      if (getEnvVar('UPLOAD_TO_CLOUDINARY')) {
        const result = await uploadToCloudinary(req.file.path);
        fileUrl = result.secure_url;
        await fs.unlink(req.file.path);
      } else {
        const newPath = path.resolve('src', 'uploads', 'messages', req.file.filename);
        await fs.rename(req.file.path, newPath);
        fileUrl = `http://localhost:8080/uploads/messages/${req.file.filename}`;
      }
    }
    const userId = req.user?.id || null;
    const message = await createMessage({
      text,
      homepage,
      fileUrl,
      fileType,
      parentId,
      userId,
      name,
      email,
    });

    res.status(201).json({ status: 201, message: 'Message created', data: message });
  } catch (error) {
    next(error);
  }
};

export const getMessagesCtrl = async (req, res, next) => {
  try {
    const messages = await getAllMessages();
    res.status(200).json({ status: 200, data: messages });
  } catch (error) {
    next(error);
  }
};

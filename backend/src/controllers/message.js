import createHttpError from 'http-errors';
import { createMessage, getAllMessages } from '../services/message.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { uploadToCloudinary } from '../utils/uploadToClaudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { getWSS } from '../server.js';
import {redisClient} from '../redisClient.js'
import { Message } from '../db/models/Message.js';
import { User } from '../db/models/User.js';

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

    const fullMessage = await Message.findOne({
      where: { id: message.id },
      include: [
        { model: User, as: 'author', attributes: ['name', 'avatarUrl'] },
      ],
    });
      
    if (!fullMessage.author && message.name) {
      fullMessage.author = {
        name: message.name,
        email: message.email,
      };
    }

    await redisClient.del('all_messages');
    console.log('🗑️ Redis cache invalidated');
    res.status(201).json({ status: 201, message: 'Message created', data: fullMessage });

    const wss = getWSS();
    if (wss) {
      const dataToSend = JSON.stringify({ type: 'new_comment', payload: fullMessage });
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(dataToSend);
        }
      });
    }

  } catch (error) {
    next(error);
  }
};



export const getMessagesCtrl = async (req, res, next) => {
  try {
    const cacheKey = 'all_messages';
    const cachedData = await redisClient.get(cacheKey);
    console.log('📦 Redis cache hit:', !!cachedData);
    if (cachedData) {
      const messages = JSON.parse(cachedData);
      return res.status(200).json({ status: 200, data: messages, cached: true });
    }

    const messages = await getAllMessages();

    await redisClient.setEx(cacheKey, 60, JSON.stringify(messages));

    res.status(200).json({ status: 200, data: messages, cached: false });
  } catch (error) {
    next(error);
  }
};


import createHttpError from 'http-errors';
import { registerUser, loginUser, logoutUser} from '../services/auth.js';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { getEnvVar } from '../utils/getEnvVar.js';
import { uploadToCloudinary } from '../utils/uploadToClaudinary.js';


const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('sessionId', session.sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    expires: session.refreshTokenValidUntil,
  });
};

export const registerUserCtrl = async (req, res) => {
  let avatar = null;

  if (req.file) {
    if (getEnvVar("UPLOAD_TO_CLOUDINARY")) {
      const result = await uploadToCloudinary(req.file.path);
      fs.unlink(req.file.path);
      avatar = result.url;
    } else {
      await fs.rename(req.file.path, path.resolve('src', 'uploads', 'avatars', req.file.filename));
      avatar = `http://localhost:8080/photos/${req.file.filename}`;
    }
  }

  const user = await registerUser({ ...req.body, avatarUrl: avatar });

  if (!getEnvVar('JWT_AUTHENTICATION')) {
    setupSession(res, user);
  }

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserCtrl = async (req, res) => {
  const session = await loginUser(req.body.email, req.body.password);
  if (!getEnvVar('JWT_AUTHENTICATION')) {
    setupSession(res, session);
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully login a user!',
    data: session,
  });
};

export const logoutUserCtrl = async (req, res) => {
  if (!getEnvVar('JWT_AUTHENTICATION') && req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).end();
};

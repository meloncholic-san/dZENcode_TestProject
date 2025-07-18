import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { getEnvVar } from '../utils/getEnvVar.js';

export function verifyCaptcha(req, res, next) {
  const { captchaCode, captchaToken } = req.body;

  if (!captchaCode || !captchaToken) {
    return next(createHttpError(400, 'CAPTCHA is required'));
  }

  try {
    const decoded = jwt.verify(captchaToken, getEnvVar('JWT_SECRET'));

    if (
      typeof decoded.captchaText !== 'string' ||
      decoded.captchaText.toLowerCase() !== captchaCode.toLowerCase()
    ) {
      return next(createHttpError(403, 'Invalid CAPTCHA'));
    }

    next();
  } catch (err) {
    return next(createHttpError(403, 'Invalid or expired CAPTCHA token'));
  }
}

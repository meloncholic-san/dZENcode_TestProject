import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';
import { Session } from '../db/models/Session.js';
import { User } from '../db/models/User.js';

export async function auth(req, res, next) {
  if (getEnvVar('JWT_AUTHENTICATION')) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next(createHttpError.Unauthorized('No Bearer token provided'));
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, getEnvVar("JWT_SECRET"));
      const user = await User.findByPk(decoded.sub);
      if (!user) return next(createHttpError.Unauthorized('User not found'));
      req.user = { id: user.id, name: user.name };
      return next();
    } catch (err) {
      return next(createHttpError.Unauthorized('Invalid or expired token'));
    }
  } else {
    const { sessionId } = req.cookies;
    if (!sessionId) return next(createHttpError.Unauthorized('No session cookie'));

    const session = await Session.findByPk(sessionId);
    if (!session || session.accessTokenValidUntil < new Date()) {
      return next(createHttpError.Unauthorized('Session invalid or expired'));
    }

    const user = await User.findByPk(session.userId);
    if (!user) return next(createHttpError.Unauthorized('User not found'));

    req.user = { id: user.id, name: user.name };
    next();
  }
}
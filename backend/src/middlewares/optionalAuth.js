import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { getEnvVar } from '../utils/getEnvVar.js';
import { User } from '../db/models/User.js';
import { Session } from '../db/models/Session.js';

export async function optionalAuth(req, res, next) {
  try {
    if (getEnvVar('JWT_AUTHENTICATION')) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, getEnvVar("JWT_SECRET"));
        const user = await User.findByPk(decoded.sub);
        if (user) {
          req.user = { id: user.id, name: user.name };
        }
      }
    } else {
      const { sessionId } = req.cookies;
      if (sessionId) {
        const session = await Session.findByPk(sessionId);
        if (session && session.accessTokenValidUntil > new Date()) {
          const user = await User.findByPk(session.userId);
          if (user) {
            req.user = { id: user.id, name: user.name };
          }
        }
      }
    }
  } catch (err) {
  }
  next();
}

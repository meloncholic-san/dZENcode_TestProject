import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { User } from '../db/models/User.js';
import { Session } from '../db/models/Session.js';
import { getEnvVar } from '../utils/getEnvVar.js';

const createSession = () => {
  return {
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 30 * 60 * 1000),
  };
};

export const registerUser = async (payload) => {
  const userExist = await User.findOne({ where: { email: payload.email } });
  if (userExist) {
    throw new createHttpError.Conflict('Email is already in use');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const newUser = await User.create({ ...payload, password: hashedPassword });

  if (getEnvVar('JWT_AUTHENTICATION')) {
    const accessToken = jwt.sign({ sub: newUser.id, name: newUser.name }, getEnvVar("JWT_SECRET"), { expiresIn: '15m' });
    return {
      ...newUser.toJSON(),
      accessToken,
    };
  } else {
    const newSession = createSession();
    const session = await Session.create({ userId: newUser.id, ...newSession });

    return {
      ...newUser.toJSON(),
      sessionId: session.id,
      accessToken: session.accessToken,
    //   refreshToken: session.refreshToken,
    //   accessTokenValidUntil: session.accessTokenValidUntil,
    //   refreshTokenValidUntil: session.refreshTokenValidUntil,
    };
  }
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }
  if (getEnvVar('JWT_AUTHENTICATION')) {
    const accessToken = jwt.sign({ sub: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '15m' });
    return {
      ...user.toJSON(),
      accessToken,
    };
  } else {
    await Session.destroy({ where: { userId: user.id } });
    const newSession = createSession();
    const session = await Session.create({ userId: user.id, ...newSession });
    return {
      ...user.toJSON(),
      sessionId: session.id,
      accessToken: session.accessToken,
    //   refreshToken: session.refreshToken,
    //   accessTokenValidUntil: session.accessTokenValidUntil,
    //   refreshTokenValidUntil: session.refreshTokenValidUntil,
    };
  }
};

export const logoutUser = async (sessionId) => {
    await Session.destroy({ where: { id: sessionId } });

};
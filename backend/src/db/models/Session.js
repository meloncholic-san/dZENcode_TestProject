import { DataTypes } from 'sequelize';
import { sequelize } from '../initSequelize.js';

export const Session = sequelize.define('Session', {
  accessToken: { type: DataTypes.STRING, allowNull: false },
  refreshToken: { type: DataTypes.STRING, allowNull: false },
  accessTokenValidUntil: { type: DataTypes.DATE, allowNull: false },
  refreshTokenValidUntil: { type: DataTypes.DATE, allowNull: false },
}, {
  timestamps: true,
});

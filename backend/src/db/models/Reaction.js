import { DataTypes } from 'sequelize';
import { sequelize } from '../initSequelize.js';

export const Reaction = sequelize.define('Reaction', {
  type: {
    type: DataTypes.ENUM('like', 'dislike'),
    allowNull: false,
  },
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'messageId'],
    }
  ]
});

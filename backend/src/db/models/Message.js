import { DataTypes } from 'sequelize';
import { sequelize } from '../initSequelize.js';

export const Message = sequelize.define('Message', {
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  homepage: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: { isUrl: true },
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fileType: {
    type: DataTypes.ENUM('image', 'text'),
    allowNull: true,
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  timestamps: true,
});

Message.prototype.countLikes = async function () {
  return await this.countReactions({ where: { type: 'like' } });
};

Message.prototype.countDislikes = async function () {
  return await this.countReactions({ where: { type: 'dislike' } });
};


import { DataTypes } from 'sequelize';
import { sequelize } from '../initSequelize.js';

export const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^[a-zA-Z0-9 ]+$/i
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  avatarUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  delete values.createdAt;
  delete values.updatedAt;
  return values;
};

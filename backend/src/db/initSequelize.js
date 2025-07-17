import { Sequelize } from 'sequelize';
import { getEnvVar } from '../utils/getEnvVar.js';

export const sequelize = new Sequelize(getEnvVar('POSTGRES_URL'), {
  dialect: 'postgres',
  logging: console.log, //logging true, reminder to false
});
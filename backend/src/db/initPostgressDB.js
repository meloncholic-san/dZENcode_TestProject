import { sequelize } from './initSequelize.js'
import './models/associations.js'


export const initPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL');
    await sequelize.sync()

    console.log('✅ DB synced');
  } catch (error) {
    console.error('❌ Failed to connect or sync DB', error);
    process.exit(1);
  }
};
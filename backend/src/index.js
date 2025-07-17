import { initPostgres } from './db/initPostgressDB.js';
import { setupServer } from './server.js';

const bootstrap = async () => {
  await initPostgres();
  await setupServer();
};

bootstrap();
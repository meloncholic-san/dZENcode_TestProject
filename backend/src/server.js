import express from 'express';
import routes from './routes/routes.js';
import cors from 'cors'
import * as fs from 'node:fs';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';





export async function setupServer() {
  const app = express();
  const PORT = getEnvVar("PORT", 3000);

  app.use(cors({origin: '*', credentials: true}));
  app.use(cookieParser());
  app.use('/api', routes);
  app.use('/avatars', express.static(path.resolve('src', 'uploads', 'avatars')));

  app.use('', notFoundHandler);
  app.use(errorHandler);
  app.listen(PORT, () => {
    console.log(`✅ Server started on port ${PORT}`);
  });
}
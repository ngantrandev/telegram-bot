import mongoose from 'mongoose';

import { MONGO_CONNECTION_STRING } from '@/configs/env.ts';

mongoose
  .connect(MONGO_CONNECTION_STRING, {
    dbName: 'telegram_bot_db',
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB: ', error);
  });

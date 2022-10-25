import { connection } from './config/redis.js';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import logger from './config/logger.js';

const addMessagesToQueue = async () => {
  const queue = new Queue('messages', { connection });

  for (let i = 1; i <= 10000; i++) {
    const data = { num: i, id: uuidv4() };
    const options = {
      removeOnComplete: true,
      removeOnFail: true,
      delay: 0,
      attempts: 0,
    };
    logger.info(`Message ${i} add to queue`);
    await queue.add('message', data, options);
  }
};

export { addMessagesToQueue };

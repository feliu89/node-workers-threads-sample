import os from 'os';
import { connection } from './config/redis.js';
import { Worker } from 'bullmq';
import throng from 'throng';
import logger from './config/logger.js';
import { delay } from './helpers/index.js';
import axios from 'axios';
import { response } from 'express';
const count = process.env.WORKERS || os.cpus().length;
const concurrency = process.env.CONCURRENCY || 10;

// Boostrap function
async function start(workerid) {
  try {
    new Worker(
      'messages',
      async (job) => {
        console.log(job.data);
        try {
          const urlshrotener = await axios.post(
            'http://localhost/api/urlshortener',
            job.data,
          );
          logger.debug(
            `wid: ${workerid}, Job: ${job.data.num}, urlshrotener: ${urlshrotener.data}`,
          );
          const urlshrotener2 = await axios.post(
            'http://localhost/api/urlshortener',
            job.data,
          );
          logger.debug(
            `wid: ${workerid}, Job: ${job.data.num}, urlshrotener2: ${urlshrotener2.data}`,
          );
          const send = await axios.post('http://localhost/api/send', job.data);
          logger.debug(
            `wid: ${workerid}, Job: ${job.data.num}, send: ${send.data}`,
          );
        } catch (err) {
          console.log('some request failed');
        }
        // >>> MAIN FUNCTIONILTY
        // await delay(Math.floor(Math.random() * 13000))
        //   .then(logger.debug(`wid: ${workerid}, Job: ${job.data.num}`))
        //   .catch((err) => console.log(err));
        // <<< MAIN FUNCTIONILTY
      },
      { connection, concurrency },
    );
  } catch (err) {
    console.log('Error on start function');
  }
}

// This will only be called once
function master() {
  console.log('Started master');
  process.on('beforeExit', () => console.log('Master cleanup.'));
}

// // This will be called four times
function worker(id, disconnect) {
  console.log(`Started worker ${id}`);
  start(id);
  process.on('SIGTERM', () => {
    console.log(`Worker ${id} exiting (cleanup here)`);
    disconnect();
  });
}

// Start cluster of workers
throng({ master, worker, count });

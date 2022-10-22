import { connection } from "./config/redis.js";
import { Worker } from 'bullmq';
import throng from 'throng';
import logger from './config/logger.js';


const workers = process.env.WORKERS || 8; //os.cpus().length

const concurrency = 5;
const lockDuration = 120000

// Initiate worker
const delay = ms => new Promise(res => setTimeout(res, ms))

async function start (workerid) {
  try {
    new Worker('messages', async job => {
      await delay(Math.floor(Math.random()*3000))
        .then(
          logger.info(`WorkerId: ${workerid}, Job: ${job.data.num}`)
        )
        .catch(err=>console.log(err))
    }, { connection, concurrency, lockDuration });
  } catch(err){
    console.log("Error on start function")
  }
}

// This will only be called once
function master() {
  console.log('Started master')
  process.on('beforeExit', () => console.log('Master cleanup.'))
}

// // This will be called four times
function worker(id, disconnect) {
  let exited = false
  start(id)
  
  console.log(`Started worker ${ id }`)
  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)
  
  async function shutdown() {
    if (exited) return
    exited = true

    await new Promise(r => setTimeout(r, 300))  // simulate async cleanup work
    console.log(`Worker ${ id } cleanup done.`)
    disconnect()
  }
}

throng({ 
  master, // Fn to call in master process (can be async)
  worker, // Fn to call in cluster workers (can be async)
  count: workers, // Number of workers
  lifetime: Infinity, // Min time to keep cluster alive (ms)
  grace: 5000, // Grace period between signal and hard shutdown (ms)
  signals: ['SIGTERM', 'SIGINT'], // Signals that trigger a shutdown (proxied to workers)
  delay: 0  // Delay between each fork is created (milliseconds)
})

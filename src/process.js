import { connection } from "./config/redis.js";
import { Queue, Worker } from 'bullmq'
import { v4 as uuidv4 } from 'uuid';

const queue = new Queue('messages', { connection });

for (let i = 1; i <= 10; i++) {
    const data = { num: i, id: uuidv4() }
    const options = { removeOnComplete: true, removeOnFail: true, delay: 0, attempts: 0 }
    console.log("Added: ",i)
    await queue.add("message", data, options )
}

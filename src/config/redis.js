import Redis from "ioredis";
import dotenv from 'dotenv';
dotenv.config();

// const connection = new Redis(process.env.REDIS_URL, {
//     maxRetriesPerRequest: null,
//     tls: {
//         rejectUnauthorized: false
//     }
// });

const connection = new Redis({
    host: "127.0.0.1",
    port: "6379",
}, {
    maxRetriesPerRequest: null
});

export { connection }


// heroku config:get REDIS_URL -a penfield-demo-playground
// heroku redis:credentials -a penfield-demo-playground
import { Router } from 'express';
import logger from '../config/logger.js';
import { delay } from '../helpers/index.js';
import { addMessagesToQueue } from '../controllers.js';

const router = Router();

router.use((req, res, next) => {
  logger.http(`${req.method} ${req.url}`);
  next();
});

router.post('/urlshortener', async (req, res) => {
  const num = req.body.num;
  try {
    //
    if (Math.random() * 100 > 20) {
      logger.info(`job: ${num} OK`);
      const delayAmmount = Math.floor(Math.random() * 3000);
      await delay(delayAmmount);
      // res.header('Location', 'https://www.penfield-digital.es');
      res.send(`Response time: ${delayAmmount} ms`);
    } else {
      logger.info(`job: ${num} FAIL`);
      const delayAmmount = 20000;
      await delay(delayAmmount);
      res.status(504).send(`Response time: ${delayAmmount} ms`);
    }
    //
  } catch (err) {
    logger.error(err);
  }
});

router.post('/send', async (req, res) => {
  try {
    //
    if (Math.random() * 100 > 10) {
      const delayAmmount = Math.floor(Math.random() * 3000);
      await delay(delayAmmount);
      // res.header('Location', 'https://www.penfield-digital.es');
      res.send(`Response time: ${delayAmmount} ms`);
    } else {
      const delayAmmount = 20000;
      await delay(delayAmmount);
      res.status(504).send(`Response time: ${delayAmmount} ms`);
    }
    //
  } catch (err) {
    logger.error(err);
  }
});

router.get('/data', async (req, res) => {
  try {
    await addMessagesToQueue();
    res.status(201).send('Data uploaded');
  } catch (err) {
    logger.error(err);
  }
});

export { router };

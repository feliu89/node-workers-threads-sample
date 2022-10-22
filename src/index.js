import express from 'express';
import dotenv from 'dotenv';
import { router } from './router.js';
dotenv.config();

const PORT = process.env.PORT || 80;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', router);

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

import { Router} from 'express';

const router = Router();

router.use((req, res, next) => {
    console.log("Inside router")
    next();
});

router.use('/test', (req, res)=> res.send('test'));

export { router };

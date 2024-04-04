import express from 'express';
import authRouter from './src/router/authRouter.js';
import chatRouter from './src/router/chatRouter.js';

const app = express();

/** Configuration */
app.use(express.json());

/** Routes */
app.use(authRouter);
app.use(chatRouter);
/** Initialization */
app.listen(5000, async () => {
    console.log('Server is alive');
});

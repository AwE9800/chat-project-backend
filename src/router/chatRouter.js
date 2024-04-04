import express from 'express';
import chatController from '../controller/chatController.js';
import jwtFilter from '../middleware/jwtFilter.js';

const router = express.Router();

router
    .get('/api/broadcast', chatController.getBroadcastMessages)
    .post('/api/broadcast', chatController.createBroadcastMessage)
    .get('/api/channel', jwtFilter.authorize, chatController.getChannels)
    .get('/api/channel/:id', jwtFilter.authorize, chatController.getChannelMessages)
    .put('/api/channel', jwtFilter.authorize, chatController.createChannel)
    .post('/api/channel/:id', jwtFilter.authorize, chatController.createChannelMessage)
    .delete('/api/channel/:id', jwtFilter.authorize, chatController.deleteChannel);

export default router;

import chatService from '../service/chatService.js';
import { ObjectId } from 'mongodb';

const getBroadcastMessages = async (req, res) => {
    try {
        const messages = await chatService.getBroadcastMessages();
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching broadcast messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createBroadcastMessage = async (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }

    try {
        const newMessage = {
            content,
            timestamp: new Date().toLocaleString('sv-SE'),
        };

        await chatService.createBroadcastMessage(newMessage);
        res.status(201).json({ message: 'Message created successfully' });
    } catch (error) {
        console.error('Error creating broadcast message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//test kod
const getChannels = async (req, res) => {
    try {
        const channels = await chatService.getChannels();
        res.status(200).json(channels);
    } catch (error) {
        console.error('Error fetching channels:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getChannelMessages = async (req, res) => {
    const id = req.params.id;
    let objectId;
    try {
        objectId = new ObjectId(id);
    } catch (e) {
        return res.status(400).send({ msg: 'Invalid id format' });
    }

    try {
        const messages = await chatService.getChannelMessages(objectId);
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching channel messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createChannel = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        await chatService.createChannel(name);
        res.status(201).json({ message: 'Channel created successfully' });
    } catch (error) {
        console.error('Error creating channel:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createChannelMessage = async (req, res) => {
    const id = req.params.id;
    const { content } = req.body;
    const username = res.locals.token.username;
    console.log(res.locals.token);
    let objectId;
    try {
        objectId = new ObjectId(id);
    } catch (e) {
        return res.status(400).send({ msg: 'Invalid id format' });
    }

    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }

    try {
        const newMessage = {
            username,
            content,
            timestamp: new Date().toLocaleString('sv-SE'),
        };
        await chatService.createChannelMessage(objectId, newMessage);
        res.status(201).json({ message: 'Message created successfully' });
    } catch (error) {
        console.error('Error creating channel message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteChannel = async (req, res) => {
    const id = req.params.id;
    let objectId;

    try {
        objectId = new ObjectId(id);
    } catch (e) {
        return res.status(400).send({ msg: 'Invalid id format' });
    }

    try {
        await chatService.deleteChannel(objectId);
        res.status(200).json({ message: 'Channel deleted successfully' });
    } catch (error) {
        console.error('Error deleting channel:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default {
    getBroadcastMessages,
    createBroadcastMessage,
    getChannels,
    getChannelMessages,
    createChannel,
    createChannelMessage,
    deleteChannel,
};

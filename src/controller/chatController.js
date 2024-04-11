import chatService from '../service/chatService.js';
import { ObjectId } from 'mongodb';

// Hämtar alla meddelanden som ska sändas till flera mottagare
const getBroadcastMessages = async (req, res) => {
    try {
        // Använd chatService för att hämta ut meddelanden som ska sändas till flera mottagare från databasen
        const messages = await chatService.getBroadcastMessages();
        // Skicka tillbaka meddelandena som JSON om det lyckas
        res.status(200).json(messages);
    } catch (error) {
        // Om det uppstår ett fel, logga felet och skicka tillbaka ett felmeddelande som JSON
        console.error('Error fetching broadcast messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Skapar ett nytt meddelande som ska sändas till flera mottagare
const createBroadcastMessage = async (req, res) => {
    const { content } = req.body;
    // Kontrollera om innehållet finns med
    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }

    try {
        const newMessage = {
            content,
            timestamp: new Date().toLocaleString('sv-SE'),
        };

        // Använd chatService för att skapa ett nytt meddelande som ska sändas till flera mottagare
        await chatService.createBroadcastMessage(newMessage);
        res.status(201).json({ message: 'Message created successfully' });
    } catch (error) {
        // Om det uppstår ett fel, logga felet och skicka tillbaka ett felmeddelande som JSON
        console.error('Error creating broadcast message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Hämtar kanalerna från databasen
const getChannels = async (req, res) => {
    try {
        // Använd chatService för att hämta kanaler från databasen
        const channels = await chatService.getChannels();
        // Skicka tillbaka kanalerna som JSON om det lyckas
        res.status(200).json(channels);
    } catch (error) {
        // Om det uppstår ett fel, logga felet och skicka tillbaka ett felmeddelande som JSON
        console.error('Error fetching channels:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Skapar en ny kanal
const createChannel = async (req, res) => {
    const { name } = req.body;
    // Kontrollera om namnet finns med
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        // Använd chatService för att skapa en ny kanal
        await chatService.createChannel(name);
        res.status(201).json({ message: 'Channel created successfully' });
    } catch (error) {
        // Om det uppstår ett fel, logga felet och skicka tillbaka ett felmeddelande som JSON
        console.error('Error creating channel:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Hämtar meddelanden från en specifik kanal
const getChannelMessages = async (req, res) => {
    const id = req.params.id;
    let objectId;
    try {
        objectId = new ObjectId(id);
    } catch (e) {
        return res.status(400).send({ msg: 'Invalid id format' });
    }

    try {
        // Använd chatService för att hämta meddelanden från en specifik kanal
        const messages = await chatService.getChannelMessages(objectId);
        res.status(200).json(messages);
    } catch (error) {
        // Om det uppstår ett fel, logga felet och skicka tillbaka ett felmeddelande som JSON
        console.error('Error fetching channel messages:', error);
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
        // Använd chatService för att ta bort en kanal
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

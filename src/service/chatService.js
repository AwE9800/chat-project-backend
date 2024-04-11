import { fetchCollection } from '../mongodb/mongodbClient.js';
import { ObjectId } from 'mongodb';

const BROADCAST_COLLECTION_NAME = 'broadcast';
const CHANNEL_COLLECTION_NAME = 'channels';

// Funktion för att hämta alla broadcastmeddelanden från databasen
const getBroadcastMessages = async () => {
    const broadcastCollection = fetchCollection(BROADCAST_COLLECTION_NAME);
    const messages = await broadcastCollection.find({}).toArray();
    return messages;
};

// Funktion för att skapa ett nytt broadcastmeddelande i databasen
const createBroadcastMessage = async message => {
    const broadcastCollection = fetchCollection(BROADCAST_COLLECTION_NAME);
    const result = await broadcastCollection.insertOne(message);
    return result.insertedId;
};

// Funktion för att hämta alla kanaler från databasen
const getChannels = async () => {
    const channelCollection = fetchCollection(CHANNEL_COLLECTION_NAME);
    const channels = await channelCollection.find({}).toArray();
    return channels;
};

// Funktion för att skapa en ny kanal i databasen
const createChannel = async name => {
    const channelCollection = fetchCollection(CHANNEL_COLLECTION_NAME);
    const result = await channelCollection.insertOne({ name, messages: [] });
    return result.insertedId;
};

// Funktion för att hämta alla meddelanden från en specifik kanal i databasen
const getChannelMessages = async channelId => {
    const channelCollection = fetchCollection(CHANNEL_COLLECTION_NAME);
    const messages = await channelCollection.findOne({ _id: channelId });
    return messages ? messages.messages : [];
};

// Funktion för att skapa ett nytt meddelande i en specifik kanal i databasen
const createChannelMessage = async (channelId, newMessage) => {
    const channelCollection = fetchCollection(CHANNEL_COLLECTION_NAME);
    const result = await channelCollection.updateOne({ _id: channelId }, { $push: { messages: newMessage } });
    return result.modifiedCount;
};

// Funktion för att ta bort en kanal från databasen
const deleteChannel = async channelId => {
    const channelCollection = fetchCollection(CHANNEL_COLLECTION_NAME);
    const result = await channelCollection.deleteOne({ _id: channelId });
    return result.deletedCount > 0;
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

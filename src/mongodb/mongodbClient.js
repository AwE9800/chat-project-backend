import { MongoClient } from 'mongodb';
import { dbDetails, url } from '../../config/config.js';

let db;

export function fetchCollection(name) {
    return fetchDatabase().collection(name);
}

function fetchDatabase() {
    if (db != undefined) {
        return db;
    }

    const client = new MongoClient(url(dbDetails.username, dbDetails.password));

    db = client.db('awesome-Chat-v1');

    return db;
}

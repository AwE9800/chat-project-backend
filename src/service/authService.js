import { fetchCollection } from '../mongodb/mongodbClient.js';
import bcrypt from 'bcrypt';
import jwtUtils from '../util/jwtUtils.js';

const USER_COLLECTION_NAME = 'users';

const create = async ({ email, password, username }) => {
    let result = await fetchCollection(USER_COLLECTION_NAME).findOne({ email });
    let user = await fetchCollection(USER_COLLECTION_NAME).findOne({ username });

    if (result != null && user != null) {
        return false;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    result = await fetchCollection(USER_COLLECTION_NAME).insertOne({ email, username, hash: hashedPassword, role: 'user' });
    return result.insertedId;
};

const exists = async ({ email, password }) => {
    let result = await fetchCollection(USER_COLLECTION_NAME).findOne({ email });

    if (!result) {
        return null;
    }

    return new Promise((resolve, reject) => {
        bcrypt.compare(password, result.hash, (err, isValid) => {
            if (err) {
                reject(err);
            } else if (isValid) {
                const claims = { email: email, username: result.username, role: result.role };
                console.log(claims);
                const token = jwtUtils.generate(claims);
                resolve(token);
            } else {
                reject(new Error('Invalid password'));
            }
        });
    });
};

export default { create, exists };

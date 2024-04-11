import { fetchCollection } from '../mongodb/mongodbClient.js';
import bcrypt from 'bcrypt';
import jwtUtils from '../util/jwtUtils.js';

const USER_COLLECTION_NAME = 'users';

// Funktion för att skapa en ny användare i databasen
const create = async ({ email, password, username }) => {
    // Kontrollera om e-postadressen eller användarnamnet redan finns i databasen
    let result = await fetchCollection(USER_COLLECTION_NAME).findOne({ email });
    let user = await fetchCollection(USER_COLLECTION_NAME).findOne({ username });

    if (result != null && user != null) {
        // Om e-postadressen eller användarnamnet redan finns, returnera false
        return false;
    }

    // Kryptera lösenordet med bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    // Skapa en ny användare i databasen med den krypterade lösenordet
    result = await fetchCollection(USER_COLLECTION_NAME).insertOne({ email, username, hash: hashedPassword, role: 'user' });
    return result.insertedId;
};

// Funktion för att kontrollera om en användare med angiven e-postadress och lösenord finns i databasen
const exists = async ({ email, password }) => {
    // Hämta användaren från databasen med den angivna e-postadressen
    let result = await fetchCollection(USER_COLLECTION_NAME).findOne({ email });

    if (!result) {
        // Om användaren inte finns, returnera null
        return null;
    }

    // Jämför det angivna lösenordet med det krypterade lösenordet i databasen med bcrypt
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, result.hash, (err, isValid) => {
            if (err) {
                // Om det uppstår ett fel, avvisa med ett felmeddelande
                reject(err);
            } else if (isValid) {
                // Om lösenordet är giltigt, generera en JWT med användarens uppgifter och lösenordet
                const claims = { email: email, username: result.username, role: result.role };
                const token = jwtUtils.generate(claims);
                resolve(token);
            } else {
                // Om lösenordet inte är giltigt, avvisa med ett felmeddelande
                reject(new Error('Invalid password'));
            }
        });
    });
};

export default { create, exists };

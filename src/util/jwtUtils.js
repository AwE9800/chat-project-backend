import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';

const mySecret = readFileSync('./config/mysecret.txt');

// Funktion för att generera en JWT med angivna anspråk (claims)
function generate(claims) {
    // Konfigurationsalternativ för JWT
    let options = {
        issuer: 'chat-api', // Utfärdaren av token
        subject: 'Auth token for chat api', // Ämnet för token
        expiresIn: '60min', // Giltighetstiden för token
    };

    // Generera och returnera en JWT med angivna anspråk och konfigurationsalternativ
    return jwt.sign(claims, mySecret, options);
}

// Funktion för att verifiera en JWT och returnera dess anspråk
function verify(token) {
    // Verifiera JWT med hemligheten och returnera dess anspråk
    return jwt.verify(token, mySecret);
}

// Exportera funktionerna generate och verify som standardexport för att användas i andra moduler
export default { generate, verify };

import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';

const mySecret = readFileSync('./config/mysecret.txt');

function generate(claims) {
    let options = {
        issuer: 'chat-api',
        subject: 'Auth token for chat api',
        expiresIn: '60m',
    };

    return jwt.sign(claims, mySecret, options);
}

function verify(token) {
    return jwt.verify(token, mySecret);
}

export default { generate, verify };

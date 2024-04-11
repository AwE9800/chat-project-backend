// Importera jwtUtils-modulen för att hantera JSON Web Tokens (JWT)
import jwtUtils from '../util/jwtUtils.js';

// Middleware-funktion för att auktorisera användare baserat på JWT
const authorize = (req, res, next) => {
    // Hämta 'authorization'-huvudet från förfrågan
    const bearer = req.headers['authorization'];

    try {
        // Kontrollera om 'authorization'-huvudet är definierat
        if (bearer == undefined) {
            return res.status(400).send({ err: 'Bad authorization header' });
        }

        // Verifiera JWT-tokenet
        const token = jwtUtils.verify(bearer.split(' ')[1]);

        // Lagra JWT-tokenet i res.locals.token för användning i efterföljande hanterare
        res.locals.token = token;
        console.log(token);
    } catch (err) {
        console.log(err);
        // Hantera olika typer av fel som kan uppstå vid verifiering av JWT-tokenet
        if (err.name == 'JsonWebTokenError') {
            return res.status(400).send({ err: 'Invalid authorization signature' });
        } else if (err.name == 'TokenExpiredError') {
            return res.status(400).send({ err: 'Authorization token expired' });
        }
    }

    // Fortsätt till nästa middleware eller hanterare
    next();
};

export default { authorize };

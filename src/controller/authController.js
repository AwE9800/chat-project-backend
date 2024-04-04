import authService from '../service/authService.js';
import jwtUtils from '../util/jwtUtils.js';

const login = async (req, res) => {
    const { email, password } = req.body; // hämtar in det vi skriver in email och apssword

    console.log(email, password);

    if (email == undefined || password == undefined) {
        // kollar om de har ett värde eller inte, om inte skickar vi ut en err
        return res.status(400).send({ err: ' invalid parameters' });
    }
    try {
        const token = await authService.exists({ email, password });

        if (token === null) {
            return res.status(401).send({ err: 'Felaktiga inloggningsuppgifter' });
        }

        res.status(200).send({ token });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ err: 'Internal server error' });
    }
};

const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (email == undefined || password == undefined || username == undefined) {
        return res.status(400).send({ err: 'Invalid parameters' });
    }

    try {
        await authService.create({ email, password, username });

        return res.status(201).send({ msg: 'Account created' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ err: 'Internal server error' });
    }
};

export default { login, register };

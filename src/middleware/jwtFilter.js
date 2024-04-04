import jwtUtils from '../util/jwtUtils.js';

const authorize = (req, res, next) => {
    const bearer = req.headers['authorization'];

    try {
        if (bearer == undefined) {
            return res.status(400).send({ err: 'Bad authorization header' });
        }

        const token = jwtUtils.verify(bearer.split(' ')[1]);

        res.locals.token = token;
        console.log(token);
    } catch (err) {
        console.log(err);
        if (err.name == 'JsonWebTokenError') {
            return res.status(400).send({ err: 'Invalid authorization signature' });
        } else if (err.name == 'TokenExpiredError') {
            return res.status(400).send({ err: 'Authorization token expired' });
        }
    }

    next();
};

export default { authorize };

// authentification middleware
const auth = async function (req, res, next) {
    res.send('hey');
    next();
}

module.exports = auth;
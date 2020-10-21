const { fixedToken } = process.env;

const pickToken = req => req.headers.authorization || req.query.authorization || null;

const compareToken = token => token === fixedToken;

exports.verifyToken = (req, res, next) => {
  const token = compareToken(pickToken(req));
  if (token) {
    next();
  } else {
    res.status(401).send({ error: true, message: 'authorization token is missing' });
  }
};

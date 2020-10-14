const { fixedToken } = process.env;

const pickToken = headers => headers.authorization || null;

const compareToken = token => token === fixedToken;

exports.verifyToken = (req, res, next) => {
  const token = compareToken(pickToken(req.headers));
  if (token) {
    next();
  } else {
    res.status(401).send({ error: true, message: `Error verify token, token: ${token}` });
  }
};

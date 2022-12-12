const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const decode = jwt.verify(token, "hush");
    if (decode) {
      const userID = decode.userID;
      next();
    } else {
      res.send("Login Required");
    }
  } else {
    res.send("Login Required");
  }
};
module.exports = {
  auth,
};

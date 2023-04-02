const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");

const startTime = process.hrtime();
const startUsage = process.cpuUsage();
const fakeData = require("./mockdata.json");

const { connect } = require("./config/db");
const { UserModel } = require("./models/User.model");
const { auth } = require("./middlewares/auth");
const { todoRouter } = require("./routes/todos.routes");

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send(`Server is Running.`);
});
app.get("/fakedata", (req, res) => {
  // console.log(fakeData);
  res.json(fakeData);
});
app.get("/cpu", (req, res) => {
  // spin the CPU for 500 milliseconds
  var now = Date.now();
  while (Date.now() - now < 500) var elapTime = process.hrtime(startTime);
  var elapUsage = process.cpuUsage(startUsage);

  var elapTimeMS = secNSec2ms(elapTime);
  var elapUserMS = secNSec2ms(elapUsage.user);
  var elapSystMS = secNSec2ms(elapUsage.system);
  var cpuPercent = Math.round((100 * (elapUserMS + elapSystMS)) / elapTimeMS);

  console.log("elapsed time ms:  ", elapTimeMS);
  console.log("elapsed user ms:  ", elapUserMS);
  console.log("elapsed system ms:", elapSystMS);
  console.log("cpu percent:      ", cpuPercent);

  function secNSec2ms(secNSec) {
    if (Array.isArray(secNSec)) {
      return secNSec[0] * 1000 + secNSec[1] / 1000000;
    }
    return secNSec / 1000;
  }
  res.json({
    cpu: cpuPercent,
  });
});

app.post("/signup", (req, res) => {
  const { email, password } = req.body;
  const IP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  try {
    bcrypt.hash(password, 2, async (err, hash) => {
      const user = new UserModel({ email, password: hash, ip: IP });
      console.log(user);
      await user.save();
      res.send("Signup Success");
    });
  } catch (error) {
    console.log(error);
    res.send("Something Bad Happend");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.find({ email });

    if (user.length > 0) {
      const hash = user[0].password;
      bcrypt.compare(password, hash, (err, result) => {
        if (result) {
          const token = jwt.sign({ userID: user[0]._id }, "hush");
          res.send({ msg: "Login success", token: token });
        } else {
          res.send("Login Failed");
        }
      });
    }
  } catch (err) {
    res.send("Something Bad Happened...");
  }
});

app.use(auth);
app.use("/todos", todoRouter);

app.listen(PORT, async () => {
  try {
    await connect;
    console.log("DB Connected");
  } catch (error) {
    console.log("DB failed");
  }
  console.log(`Server listening on ${PORT}`);
});

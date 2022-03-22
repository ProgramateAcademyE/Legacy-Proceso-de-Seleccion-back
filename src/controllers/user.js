const User = require("../db/models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("./sendMail");
const userRouter = require("express").Router();
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const transporter = require("../utils/senMail");

const { CLIENT_URL, EMAIL } = process.env;

//error messages
const errorFields = "Por favor llene todos los campos. ";
const errorInvalidEmail = "Correo electrónico inválido. ";
const errorExistEmail = "Este correo electrónico ya existe. ";
const errorCharactersPassword =
  "La contraseña debe contar con mínimo 6 caracteres. ";

//create a new user
userRouter.post("/register", async (req, res) => {
  try {
    const { names, surname, email, password } = req.body;
    console.log(req.body);
    if (!names || !surname || !email || !password)
      return res.status(400).send({ msg: errorFields });

    if (!validateEmail(email))
      // Call the function validate email.
      return res.status(400).send({ msg: errorInvalidEmail });

    const user = await User.findOne({ email }); // Check if the email exists

    if (user) return res.status(400).send({ msg: errorExistEmail });

    if (password.length < 6)
      return res.status(400).send({ msg: errorCharactersPassword });

    const passwordHash = await bcrypt.hash(password, 12); // Encrypt password to save to DB

    const newUser = {
      names,
      surname,
      email,
      passwordHash,
    };

    const activation_token = createActivationToken(newUser);

    const url = `${CLIENT_URL}api/user/activation/${activation_token}`;

    await transporter.sendMail({
      from: ' "Validate your email" <jairovsolarte17@gmail.com> ',
      to: email,
      subject: "Validate your email",
      html: `
							<b>Please click on the following link, or paste this into your browser to complete the process: </b>
							<a href='${url}'>${url}</a>
						`,
    });

    res.status(200).send({
      msg: "Registro exitoso. Verifica tu bandeja de correos electrónicos para avtivar la cuenta. ",
      token: activation_token,
    });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

//create a profile different to a user
userRouter.post("/register_admin", async (req, res) => {
  try {
    const { names, surname, email, password, role } = req.body;

    if (!names || !surname || !email || !password || !role)
      return res.status(400).send({ msg: errorFields });

    if (!validateEmail(email))
      return res.status(400).send({ msg: errorInvalidEmail });

    const user = await User.findOne({ email });

    if (user) return res.status(400).send({ msg: errorExistEmail });

    if (password.length < 6)
      return res.status(400).send({ msg: errorCharactersPassword });

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = new User({
      names,
      surname,
      email,
      passwordHash,
      role,
    });

    await newUser.save();
    res.send({ msg: "Perfil creado exitosamente. " });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

// User activation
userRouter.get("/activation/:activation_token", async (req, res) => {
  try {
    const { activation_token } = req.params;

    const user = jwt.verify(
      activation_token,
      process.env.ACTIVATION_TOKEN_SECRET
    );

    const { names, surname, email, passwordHash } = user;

    const check = await User.findOne({ email });
    if (check) return res.status(400).send({ msg: errorExistEmail });

    const newUser = new User({
      names,
      surname,
      email,
      passwordHash,
    });

    await newUser.save();

    res.send({ msg: "La cuenta fue activada exitosamente. " });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

userRouter.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    const isMatch =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      console.log("INCORRECT CREDENTIALS");
      res.status(401).send("Something broke!");
      return;
    } else {
      const refresh_token = createRefreshToken({ id: user._id });

      res.status(200).send({
        email: user.email,
        refresh_token,
        msg: "Login exitoso!",
      });
      return;
    }
  } catch (err) {
    return res.send({ msg: err.message });
  }
});

userRouter.post("/refresh_token", async (req, res) => {
  try {
    const rf_token = req.body.refreshtoken;
    if (!rf_token) return res.status(400).send({ msg: "Please login now!" });

    jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(400).send({ msg: "Please login now!" });
      const access_token = createAccessToken({ id: user.id });
      res.send({ access_token });
    });
    // res.json({msg: 'ok'})
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

userRouter.post("/forgot", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .send({ msg: "Este correo electrónico no existe. " });

    const access_token = createAccessToken({ id: user._id });
    const url = `${CLIENT_URL}/user/reset/${access_token}`;

    sendMail(email, url, "Reestablese tu contraseña. ");
    res.send({ msg: "Contraseña reenviada, verifica tu correo electrónico. " });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

userRouter.post("/reset", auth, async (req, res) => {
  try {
    const { password } = req.body;
    const passwordHash = await bcrypt.hash(password, 12);

    await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        passwordHash: passwordHash,
      }
    );

    res.send({ msg: "Password successfully changed!" });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

userRouter.get("/info", auth, async (req, res) => {
	try {
		const user = await User.findById(req.body.user.id).select("-password");

    res.send(user);
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

userRouter.get("/all_info", auth, authAdmin, async (req, res) => {
	try {
		const users = await User.find().select("-password").select("-passwordHash");

    res.send(users);
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

userRouter.get("/logout", async (req, res) => {
  try {
    res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
    return res.send({ msg: "Logged out." });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

userRouter.patch("/update", auth, async (req, res) => {
  try {
    const { names, surname, avatar } = req.body;
    await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        names,
        surname,
        avatar,
      }
    );

    res.send({ msg: "Update Success!" });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

userRouter.patch("/update_role/:id", auth, authAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        role,
      }
    );

    res.send({ msg: "Update Success!" });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

userRouter.delete("/delete/:id", auth, authAdmin, async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        deleted,
      }
    );

    res.send({ msg: "Deleted Success!" });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,:\s@\"]+(\.[^<>()[\]\\.,:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: "5m",
  });
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = userRouter;

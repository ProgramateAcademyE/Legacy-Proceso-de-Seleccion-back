const User = require("../db/models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("./sendMail");
const userRouter = require("express").Router();
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const transporter = require("../utils/senMail");
const pagination = require("./pagination");
// const transporter = require("../utils/senMail");

const { CLIENT_URL, EMAIL } = process.env;

//error messages
const errorFields = "Por favor llene todos los campos. ";
const errorInvalidEmail = "Correo electrónico inválido. ";
const errorExistEmail = "Este correo electrónico ya existe. ";
const errorCharactersPassword =
  "La contraseña debe contar con mínimo 6 caracteres. ";
const msgLogNow = "Por favor inicia sesión ahora. ";
const updateSuccess = "Información actualizada exitosamente";

//create a new user
userRouter.post("/register", async (req, res) => {
  try {
    const { names, surname, email, password } = req.body;
    console.log(req.body);
    if (!names || !surname || !email || !password)
      return res.status(400).send({ msg: errorFields });
    // Call the function validate email.
    if (!validateEmail(email))
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
    //Call the function to create a token to a new user
    const activation_token = createActivationToken(newUser);
    const url = `${CLIENT_URL}verify?token=${activation_token}`;

    sendMail(email, url, "Activa tu cuenta");

    res.status(200).send({
      msg: "Registro exitoso. Verifica tu bandeja de correos electrónicos para avtivar la cuenta. ",
      token: activation_token,
    });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

//create a profile different to a user
userRouter.post("/register_admin", auth, authAdmin, async (req, res) => {
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

 userRouter.post("/register_staff", async (req, res) => {
	 console.log("prueba", req.body)
	 try { 
		const { names, surname, email, password, role } = req.body;
  
		 if (!names || !surname || !email || !password || !role)
		  return res.status(400).send({ msg: errorFields }); 
  
		  if (!validateEmail(email)) 
		  return res.status(400).send({ msg: errorInvalidEmail }); 
  
		  const user = await User.findOne({ email });
		   if (user) 
		  return res.status(400).send({ msg: errorExistEmail }); 
  
		  if (password.length < 6) 
		  return res.status(400).send({ msg: errorCharactersPassword }); 
  
		  const passwordHash = await bcrypt.hash(password, 12); 
		  
		  const addUser = new User({ 
			  names, 
			  surname,
			  email, 
			  passwordHash, 
			  role,
		   }); 
  
		  await addUser.save();
		  res.send({ msg: "Perfil creado exitosamente. " }); 
	  } 
	  catch (err)
	   { return res.status(500).send({ msg: err.message });
   } }); 

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

// Login user
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    const isMatch =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      res.status(401).send("Ocurrió un error. ");
      return;
    } else {
      //Call the function to create a token to login
      const refresh_token = createRefreshToken({ id: user._id });

      res.status(200).header("Authorization", refresh_token).send({
        email: user.email,
        refresh_token,
        msg: "Inicio de sesión exitoso. ",
      });
      return;
    }
  } catch (err) {
    return res.send({ msg: err.message });
  }
});

// Renew token if token is expired
userRouter.post("/refresh_token", async (req, res) => {
  try {
    const rf_token = req.body.refreshtoken;
    if (!rf_token) return res.status(400).send({ msg: msgLogNow });

    jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(400).send({ msg: msgLogNow });
      //Call the function to create a new token to access to the count
      const access_token = createAccessToken({ id: user.id });
      res.send({ access_token });
    });
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
    //Call the function to create a new token to access to the count
    const access_token = createAccessToken({ id: user._id });
    const url = `${CLIENT_URL}/user/reset/${access_token}`;

    sendMail(email, url, "Reestablece tu contraseña.");

    res.send({
      msg: "Verifica tu correo electrónico para restablecer tu contraseña. ",
    });
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

    res.send({ msg: "Nueva contraseña asignada exitosamente. " });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

// Get one user info (need to auth)
userRouter.get("/info", auth, async (req, res) => {
  try {
    const user = await User.findById(req.body.user.id).select("-password");

    res.send(user);
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

//auth, authAdmin,
// get all info (need to auth and be admin)
userRouter.get("/all_info/:page", async (req, res) => {
  try {
    const perPage = 3;
    const page = req.params.page || 1;
    const [profiles, total] = await Promise.all([
      User.find()
        .select("-password")
        .select("-passwordHash")
        .skip(perPage * page - perPage)
        .limit(perPage),
      User.countDocuments(),
    ]);

    res.json({
      profiles,
      page: {
        page,
        perPage,
        total,
      },
    });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

// ========================================CAROL

//trae todos los usuarios segun los roles
userRouter.get("/users_info", auth, async (req, res) => {
  try {
    const users = await User.find({ role: { $eq: 0 } });
    res.send(users);
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

userRouter.get("/admins_info", async (req, res) => {
  try {
    const admins = await User.find({ role: { $eq: 1 } });

    res.send(admins);
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

userRouter.get("/moderator_info", async (req, res) => {
  try {
    const interviewer = await User.find({ role: { $eq: 2 } });
    res.send(interviewer);
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

userRouter.get("/observator_info", async (req, res) => {
  try {
    const interviewer = await User.find({ role: { $eq: 3 } });
    res.send(interviewer);
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

userRouter.get("/interviewer_info", async (req, res) => {
  try {
    const interviewer = await User.find({ role: { $eq: 4 } });
    res.send(interviewer);
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

userRouter.get("/roles_meeting_info", async (req, res) => {
  try {
    const interviewer = await User.find({ role: { $ne: 0 } });
    res.send(interviewer);
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

userRouter.get("/filter/:userId",async (req, res) => {
	const UserConsult = (req.params.userId)
	console.log("user", UserConsult)
	const allUserConsult = await User.findById(UserConsult)
	console.log("user", allUserConsult)
});

userRouter.put("/update/:userId", async (req, res) => {
  try {
    console.log(req.body);

    const updateUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).send({ updateUser });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

userRouter.delete("/delete/:id", async (req, res) => {
  try {
    await User.findOneAndRemove({ _id: req.params.id });

    res.send({ msg: "Perfil eliminado de la base de datos. " });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

// ==============================CAROL

// Logout
userRouter.get("/logout", async (req, res) => {
  try {
    res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
    return res.send({ msg: "Cerrado de sesión exitoso. " });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

// Update role (need to auth and be admin)
userRouter.patch("/update_role/:id", auth, authAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    await User.findOneAndUpdate({ _id: req.params.id }, { role });

    res.send({ msg: updateSuccess });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

userRouter.patch("/active/:id", auth, authAdmin, async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        active,
      }
    );

    res.send({ msg: updateSuccess });
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

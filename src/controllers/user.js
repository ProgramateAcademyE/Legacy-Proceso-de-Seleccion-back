const User = require("../db/models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("./sendMail");
const userRouter = require("express").Router();
const auth = require("../middleware/auth");
// const authAdmin = require('../middleware/authAdmin')
const authAdmin = require("../middleware/authAdmin");
const { CLIENT_URL } = process.env;

userRouter.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password)
            return res.status(400).json({ msg: "Please fill in all fields." });

        if (!validateEmail(email))
            return res.status(400).json({ msg: "Invalid emails." });

        const user = await User.findOne({ email });

        if (user)
            return res.status(400).json({ msg: "This email already exists." });

        if (password.length < 6)
            return res
                .status(400)
                .json({ msg: "Password must be at least 6 characters." });

        const passwordHash = await bcrypt.hash(password, 12);

        const newUser = {
            name,
            email,
            passwordHash,
        };

        const activation_token = createActivationToken(newUser);

        const url = `${CLIENT_URL}/user/activate/${activation_token}`;
        sendMail(email, url, "Verify your email address");

        res.json({
            msg: "Register Success! Please activate your email to start.",
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

userRouter.post("/register_admin", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role)
            return res.status(400).json({ msg: "Please fill in all fields." });

        if (!validateEmail(email))
            return res.status(400).json({ msg: "Invalid emails." });

        const user = await User.findOne({ email });

        if (user)
            return res.status(400).json({ msg: "This email already exists." });

        if (password.length < 6)
            return res
                .status(400)
                .json({ msg: "Password must be at least 6 characters." });

        const passwordHash = await bcrypt.hash(password, 12);

        const newUser = new User({
            name,
            email,
            passwordHash,
            role,
        });

        await newUser.save();
        res.json({ msg: "User has been create!" });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

userRouter.post("/activation", async (req, res) => {
    try {
        const { activation_token } = req.body;
        const user = jwt.verify(
            activation_token,
            process.env.ACTIVATION_TOKEN_SECRET
        );

        const { name, email, passwordHash } = user;

        const check = await User.findOne({ email });
        if (check)
            return res.status(400).json({ msg: "This email already exists." });

        const newUser = new User({
            name,
            email,
            passwordHash,
        });

        await newUser.save();

        res.json({ msg: "Account has been activated!" });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

userRouter.post("/login", async (req, res) => {
    try {
        console.log(req.body, "ingresologin");
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        const isMatch =
            user === null
                ? false
                : await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({
                error: "Invalid password or user",
            });
        }

        const refresh_token = createRefreshToken({ id: user._id });
        // res.cookie('refreshtoken', refresh_token, {
        //     httpOnly: false,
        //     path: '/api/refresh_token',
        //     maxAge: 7*24*60*60*1000 // 7 days
        // })
        res.send({
            email: user.email,
            refresh_token,
            msg: "Login success!",
        });
        // res.json({msg: "Login success!"})
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});
userRouter.post("/refresh_token", async (req, res) => {
    try {
        console.log(req.body.refreshtoken);
        const rf_token = req.body.refreshtoken;
        if (!rf_token)
            return res.status(400).json({ msg: "Please login now!" });

        jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(400).json({ msg: "Please login now!" });
            const access_token = createAccessToken({ id: user.id });
            res.json({ access_token });
        });
        // res.json({msg: 'ok'})
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

userRouter.post("/forgot", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ msg: "This email does not exist." });

        const access_token = createAccessToken({ id: user._id });
        const url = `${CLIENT_URL}/user/reset/${access_token}`;

        sendMail(email, url, "Reset your password");
        res.json({ msg: "Re-send the password, please check your email." });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
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

        res.json({ msg: "Password successfully changed!" });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

userRouter.get("/info", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        res.json(user);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

userRouter.get("/all_info", auth, authAdmin, async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.json(users);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

userRouter.get("/logout", async (req, res) => {
    try {
        res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
        return res.json({ msg: "Logged out." });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});
userRouter.patch("/update", auth, async (req, res) => {
    try {
        const { name, avatar } = req.body;
        await User.findOneAndUpdate(
            { _id: req.user.id },
            {
                name,
                avatar,
            }
        );

        res.json({ msg: "Update Success!" });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
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

        res.json({ msg: "Update Success!" });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

userRouter.delete("/delete/:id", auth, authAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);

        res.json({ msg: "Deleted Success!" });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

const validateEmail = (email) => {
    const re =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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

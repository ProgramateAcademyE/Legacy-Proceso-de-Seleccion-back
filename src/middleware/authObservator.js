const User = require("../db/models/User");

const authObservator = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.body.user.id });

    if (user.role !== 3)
      return res
        .status(500)
        .json({ msg: "Observator resources access denied." });

    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = authObservator;

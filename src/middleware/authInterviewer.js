const User = require("../db/models/User");

const authInterviewer = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.body.user.id });

    if (user.role !== 4)
      return res
        .status(500)
        .json({ msg: "Interviewer resources access denied." });

    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = authInterviewer;

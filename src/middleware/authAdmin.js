const User = require("../db/models/User");

/**
 * It checks if the user is an admin or not
 * @param req - The request object.
 * @param res - The response object.
 * @param next - This is a function that you call when your middleware is complete.
 * @returns The user's role.
 */
const authAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.body.user.id });

    if (user.role !== 1)
      return res.status(500).json({ msg: "Admin resources access denied." });

    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = authAdmin;

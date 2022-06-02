const User = require("../db/models/User");

/**
 * It checks if the user is a moderator, if not, it returns a 500 status code with a message
 * @param req - The request object.
 * @param res - The response object.
 * @param next - This is a function that you call when you want to pass control to the next middleware
 * function in the stack.
 * @returns The user object.
 */
const authModerator = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.body.user.id });

    if (user.role !== 2)
      return res
        .status(500)
        .json({ msg: "Moderator resources access denied." });

    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = authModerator;

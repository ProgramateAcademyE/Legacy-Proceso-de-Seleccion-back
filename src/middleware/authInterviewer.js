const User = require("../db/models/User");

/**
 * If the user's role is not equal to 4, then return a status of 500 and a message of "Interviewer
 * resources access denied."
 *
 * If the user's role is equal to 4, then move on to the next function
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 */
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

const User = require("../db/models/User");

/**
 * If the user's role is not 3, then return a 500 status code with a message saying that the user does
 * not have access to the resource.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 */
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

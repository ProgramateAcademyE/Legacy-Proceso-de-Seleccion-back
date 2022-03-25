const { Router } = require("express");

const candidateRouter = require("../controllers/candidate");
const adminRouter = require("../controllers/admin");
const staffRouter = require("../controllers/staff");
const userRouter = require("../controllers/user");

const router = Router();

router.use("/api/candidate", candidateRouter);
router.use("/candidate/index", candidateRouter);
router.use("/api/admin", adminRouter);
router.use("/api/staff", staffRouter);
router.use("/api/user", userRouter);

module.exports = router;

import { Router, Request } from "express";
import { authController } from "../../../../controllers";

const authRouter = Router();
// all: ./api/auth
authRouter.post("/google", authController.loginWithGoogle);
authRouter.get("/verify", authController.verifyUser, (req: Request, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

export default authRouter;

import { Router } from "express";
import { celebrate } from "celebrate";

import { registerUserSchema, verifyTokenSchema, resendVerifyEmailSchema, loginUserSchema } from "../validations/authValidation.js";

import { registerUser, verifyUserEmail, resendVerifyUserEmail, loginUser, refreshUserSession, logoutUser } from "../controllers/authControllers.js";

const authRouter = Router();

authRouter.post("/register", celebrate(registerUserSchema), registerUser);

authRouter.post("/verify", celebrate(verifyTokenSchema), verifyUserEmail);

authRouter.post("/verify/resend", celebrate(resendVerifyEmailSchema), resendVerifyUserEmail);

authRouter.post("/login", celebrate(loginUserSchema), loginUser);

authRouter.post("/refresh", refreshUserSession);

authRouter.post("/logout", logoutUser);

export default authRouter;

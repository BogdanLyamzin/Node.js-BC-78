import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Handlebars from "handlebars";
import {resolve} from "node:path";
import {readFile} from "node:fs/promises";

import User from "../db/models/User.js";
import Session from "../db/models/Session.js";

import { createSession, setSessionCookies } from "../services/auth.js";
import sendEmail from "../services/sendEmail.js";

const {JWT_SECRET, FRONTEND_URL} = process.env;

const verifyEmailTemplatePath = resolve("src", "templates", "verify-email.html");
const verifyEMailTemplateSource = await readFile(verifyEmailTemplatePath, "utf-8");

const createVerifyEmail = (newUser)=> {
  const payload = {
    id: newUser._id,
    email: newUser.email,
  };

  const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "24h"});

  const template = Handlebars.compile(verifyEMailTemplateSource);

  const html = template({
    username: newUser.username || newUser.email,
    link: `${FRONTEND_URL}/sign-up?token=${token}`
  });

  const verifyEmail = {
    to: newUser.email,
    subject: "Verify email",
    html,
  };

  return verifyEmail;
}

export const registerUser = async (req, res)=> {
  const {email, password, username} = req.body;
  const user = await User.findOne({email});
  if(user) throw createHttpError(400, "Email in use");

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({...req.body, password: hashPassword});

  const verifyEmail = createVerifyEmail(newUser);

  await sendEmail(verifyEmail);

  // const session = await createSession(user._id);
  // setSessionCookies(res, session);

  res.status(201).json(newUser);
}

export const verifyUserEmail = async(req, res)=> {
  const {token} = req.body;
  try {
    const {id: _id, email} = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({_id, email});
    if(!user) throw createHttpError(401, "User not found");
    user.verify = true;
    await user.save();

    res.json({
      message: "Email verify successfully"
    })
  }
  catch(error) {
    throw createHttpError(401, error.message);
  }
}

export const resendVerifyUserEmail = async(req, res)=> {
  const {email} = req.body;
  const user = await User.findOne({email});
  if(!user) throw createHttpError(401, "User not found");

  if(user.verify) throw createHttpError(401, "User already verified");

  const verifyEmail = createVerifyEmail(user);

  await sendEmail(verifyEmail);

  res.json({
    message: "Verify email resend succesffully"
  })
}

export const loginUser = async(req, res)=> {
  const {email, password} = req.body;
  const user = await User.findOne({email});

  if(!user) throw createHttpError(401, "Email or password invalid");

  if(!user.verify) throw createHttpError(401, "Email not verified");

  const comparePassword = await bcrypt.compare(password, user.password);
  if(!comparePassword) throw createHttpError(401, "Email or password invalid");

  await Session.deleteOne({userId: user._id});
  const session = await createSession(user._id);
  setSessionCookies(res, session);

  res.json(user);
}

export const refreshUserSession = async(req, res)=> {
  const {sessionId, refreshToken} = req.cookies;
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if(!session) throw createHttpError(401, "Session not found");
  const isSessionExpired = new Date() > new Date(session.refreshTokenValidUntil);
  if(isSessionExpired) throw createHttpError(401, "Session token expired");

  await Session.deleteOne({_id: sessionId});
  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.json({
    message: "Session refreshed"
  })
}

export const logoutUser = async(req, res)=> {
  const {sessionId} = req.cookies;
  if(sessionId) {
    await Session.deleteOne({_id: sessionId});
  }

  res.clearCookie("sessionId");
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(204).send();
}

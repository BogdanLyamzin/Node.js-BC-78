import createHttpError from "http-errors";
import bcrypt from "bcrypt";

import User from "../db/models/User.js";
import Session from "../db/models/Session.js";

import { createSession, setSessionCookies } from "../services/auth.js";

export const registerUser = async (req, res)=> {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if(user) throw createHttpError(400, "Email in use");

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({...req.body, password: hashPassword});

  const session = await createSession(user._id);
  setSessionCookies(res, session);

  res.status(201).json(newUser);
}

export const loginUser = async(req, res)=> {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if(!user) throw createHttpError(401, "Email or password invalid");
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

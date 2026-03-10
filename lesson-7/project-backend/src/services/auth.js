import crypto from "crypto";

import Session from "../db/models/Session.js";

import { accessTokenLifetime, refreshTokenLifetime } from "../constants/authConstants.js";

export const createSession = userId => {
  const accessToken = crypto.randomBytes(30).toString("base64");
  const refreshToken = crypto.randomBytes(30).toString("base64");

  return Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now()) + accessTokenLifetime,
    refreshTokenValidUntil: new Date(Date.now()) + refreshTokenLifetime,
  })
}

export const setSessionCookies = (res, session) => {
  res.cookie("sessionId", session._id, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: refreshTokenLifetime,
  });

  res.cookie("accessToken", session.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: accessTokenLifetime,
  });

  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: accessTokenLifetime,
  });
}

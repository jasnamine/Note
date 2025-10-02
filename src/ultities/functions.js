const jwt = require("jsonwebtoken");
const client = require("../config/connectRedis");
require("dotenv").config();

const signJwt = (payload, secret, options) =>
  new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) return reject(err);
      resolve(token);
    });
  });

const verifyJwt = (token, secret) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });

const signRefreshToken = async (user) => {
  try {
    const payload = { id: user.id, username: user.username, email: user.email };
    const secret = process.env.JWT_REFRESH_KEY;
    const options = { expiresIn: process.env.JWT_EXPIRE_REFRESH };
    const token = await signJwt(payload, secret, options);
    await client.set(String(user.id), token, { EX: 7 * 24 * 60 * 60 });
    return token;
  } catch (err) {
    console.error("Error signing refresh token:", err);
    throw new Error("Failed to sign refresh token");
  }
};

const verifyRefreshToken = async (refreshToken) => {
  try {
    const key = process.env.JWT_REFRESH_KEY;
    const payload = await verifyJwt(refreshToken, key);
    const storedToken = await client.get(String(payload.id));

    if (!storedToken) throw new Error("Refresh token not found in Redis");
    if (refreshToken !== storedToken) throw new Error("Invalid refresh token");

    return payload;
  } catch (err) {
    console.error("Error verifying refresh token:", err);
    throw new Error("Invalid refresh token");
  }
};

const signAccessToken = async (user) => {
  try {
    const payload = { id: user.id, username: user.username, email: user.email };
    const secret = process.env.JWT_ACCESS_KEY;
    const options = { expiresIn: process.env.JWT_EXPIRE_ACCESS };
    return await signJwt(payload, secret, options);
  } catch (err) {
    console.error("Error signing access token:", err);
    throw new Error("Failed to sign access token");
  }
};

module.exports = { signAccessToken, signRefreshToken, verifyRefreshToken };

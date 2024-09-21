"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandle } = require("../helper/asyncHandler");
const { AuthFailError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/Users/keyToken.service");
const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rftokens-id",
};

const createTokenPair = async (payload, publickey, privatekey) => {
  try {
    const accessToken = await JWT.sign(payload, privatekey, {
      algorithm: 'RS256', // Use RS256 for RSA
      expiresIn: '2 days',
    });

    const refreshToken = await JWT.sign(payload, privatekey, {
      algorithm: 'RS256', // Use RS256 for RSA
      expiresIn: '7 days',
    });

    JWT.verify(accessToken, publickey, { algorithms: ['RS256'] }, (err, decode) => {
      if (err) {
        console.log('error verify::', err);
      } else {
        console.log('verify success::', decode);
      }
    });
    
    return { refreshToken, accessToken };
  } catch (error) {
    console.log(error);
  }
};

const authorization = asyncHandle(async (req, res, next) => {
  const user_id = req.headers[HEADER.CLIENT_ID];
  if (!user_id) throw new AuthFailError("Invalid request");

  const keyStore = await findByUserId(user_id);
  if (!keyStore || !keyStore.publicKey || !keyStore.privateKey) {
    throw new NotFoundError("Key not found in DB.");
  }

  // Check for refresh token
  if (req.headers[HEADER.REFRESHTOKEN]) {
    const refreshToken = req.headers[HEADER.REFRESHTOKEN];
    try {
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey, { algorithms: ['RS256'] });
      if (user_id != decodeUser.user_id) throw new AuthFailError("Invalid UserId");
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error; // Log or handle error as needed
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailError("Invalid request");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey, { algorithms: ['RS256'] });
    if (user_id != decodeUser.user_id) throw new AuthFailError("Invalid User");
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw error; // Log or handle error as needed
  }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};
module.exports = { createTokenPair, verifyJWT, authorization };

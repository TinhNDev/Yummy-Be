'use strict';

const JWT = require('jsonwebtoken');
const { asyncHandle } = require('../helper/asyncHandler');
const { AuthFailError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/Users/keyToken.service');
const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESHTOKEN: 'x-rftokens-id',
  ADMIM_KEY: 'x-admin-key',
};

const createTokenPair = async (payload, publickey, privatekey) => {
  try {
    const accessToken = await JWT.sign(payload, privatekey, {
      algorithm: 'RS256',
      expiresIn: '2 days',
    });

    const refreshToken = await JWT.sign(payload, privatekey, {
      algorithm: 'RS256',
      expiresIn: '7 days',
    });

    JWT.verify(
      accessToken,
      publickey,
      { algorithms: ['RS256'] },
      (err, decode) => {
        if (err) {
          console.log('error verify::', err);
        } else {
          console.log('verify success::', decode);
        }
      }
    );

    return { refreshToken, accessToken };
  } catch (error) {
    console.log(error);
  }
};

const authorization = asyncHandle(async (req, res, next) => {
  const user_id = req.headers[HEADER.CLIENT_ID];
  if (!user_id) throw new AuthFailError('Invalid request');

  const keyStore = await findByUserId(user_id);
  if (!keyStore || !keyStore.publicKey || !keyStore.privateKey) {
    throw new NotFoundError('Key not found in DB.');
  }

  if (req.headers[HEADER.REFRESHTOKEN]) {
    const refreshToken = req.headers[HEADER.REFRESHTOKEN];
    try {
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey, {
        algorithms: ['RS256'],
      });
      if (user_id != decodeUser.user_id)
        throw new AuthFailError('Invalid UserId');
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailError('Invalid request');

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey, {
      algorithms: ['RS256'],
    });
    if (user_id != decodeUser.user_id) throw new AuthFailError('Invalid User');
    req.keyStore = keyStore;
    req.user = decodeUser;
    req.role = decodeUser.role;
    return next();
  } catch (error) {
    throw error;
  }
});
const checkRole = (allowedRoles) =>
  asyncHandle(async (req, res, next) => {
    const userRoles = req.user.role;
    if (userRoles.includes('admin')) {
      return next();
    }

    const hasRole = allowedRoles.some((role) => userRoles.includes(role));
    if (!hasRole) {
      throw new ForbiddenError('Access denied: Insufficient role');
    }
    next();
  });
const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};
module.exports = { createTokenPair, verifyJWT, authorization, checkRole };

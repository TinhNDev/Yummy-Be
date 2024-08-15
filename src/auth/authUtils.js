const JWT = require("jsonwebtoken");

const createTokenPair = async (payload, publickey, privatekey) => {
  try {
    const accessToken = await JWT.sign(payload, publickey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privatekey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publickey, (err, decode) => {
      if (err) {
        console.log(`error verify:: `, err);
      } else {
        console.log(`verify success:: `, decode);
      }
    });

    return { refreshToken, accessToken };
  } catch (error) {
    console.log(error);
  }
};
module.exports = { createTokenPair };

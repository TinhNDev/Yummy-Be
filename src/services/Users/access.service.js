"use strict";

const { BadRequestError } = require("../../core/error.response");
const db=require('../../models/index.model')
const user=db.User
const bcrypt = require("bcrypt");
const crypto=require('crypto')
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../../auth/authUtils");
const getInforData=require("../../utils/index")
class AccessService {
  static singUp = async ({ username, password, email }) => {
    const holderUser = await user.findOne({ 
      where:{
        email
      } 
    });
    if (holderUser) {
      throw new BadRequestError(`Error: An email already resgistered`);
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await user.create({
      username,
      password: hashPassword,
      email,
    });

    if (newUser) {
      const publickey = crypto.randomBytes(64).toString("hex");
      const privatekey = crypto.randomBytes(64).toString("hex");
      console.log(publickey, privatekey);

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publickey,
        privatekey,
      });
      if (!keyStore) {
        throw new BadRequestError("Error: Key not in database");
      }
      const tokens = await createTokenPair(
        {
          userId: newUser._id,
          email,
        },
        publickey,
        privatekey
      );
      console.log(`Create tokens successfully::`, tokens);

      return {
        code: 201,
        metadata: {
          user: getInforData({
            fileds: ["_id", "name", "email"],
            object: newUser,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
}
module.exports = AccessService;

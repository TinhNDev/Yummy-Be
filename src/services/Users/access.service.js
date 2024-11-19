"use strict";

const {
  BadRequestError,
  AuthFailError,
  ForbiddenError,
} = require("../../core/error.response");
const db = require("../../models/index.model");
const user = db.User;
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../../auth/authUtils");
const getInforData = require("../../utils/index");
const { findByEmail, findRoleByEmail } = require("./user.service");
class AccessService {
  static singUp = async ({ password, email,fcmToken, role }) => {
    const holderUser = await user.findOne({
      where: {
        email,
      },
    });
    if (holderUser) {
      throw new BadRequestError(`Error: An email already resgistered`);
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await user.create({
      password: hashPassword,
      email,
    });
    const roleRecord = await db.Roles.findOne({ where: { name: role } });
    if (!roleRecord) {
      throw new BadRequestError("Vai trò không hợp lệ");
    }
    await newUser.addRoles(roleRecord);
    if (newUser) {
      const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
      });
      console.log(publicKey, privateKey);
      const tokens = await createTokenPair(
        {
          user_id: newUser.id,
          email,
          role
        },
        publicKey,
        privateKey
      );
      const keyStore = await KeyTokenService.createKeyToken({
        user_id: newUser.id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken,
        fcmToken
      });
      if (!keyStore) {
        throw new BadRequestError("Error: Key not in database");
      }
      return {
        code: 201,
        user: getInforData({
          fileds: ["id", "email"],
          object: newUser,
        }),
        tokens,
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
  static login = async ({ email, password, refreshToken = null,fcmToken }) => {
    /*
            #step1: check exist email
            #step2: check match password
            #step3: create AT, RT and save
            #step4: generate tokens
            #step5: get data return login
        */
    //check user exist
    const foundUser = await findByEmail({ email });
    if (!foundUser) throw new BadRequestError("User not registered");
    const data = await findRoleByEmail({email})
    const role = data?.roles?.[0]?.name;
    //check match password
    const matchPassword = await bcrypt.compare(password, foundUser.password);

    if (!matchPassword) throw new AuthFailError("password incorrect");
    //create AT and RT and save
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048, // Độ dài khóa trong bits
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    //grenerate tokens
    const tokens = await createTokenPair(
      { user_id: foundUser.id, email ,role},
      publicKey,
      privateKey,
      
    );
    console.log("day la token", tokens);
    await KeyTokenService.createKeyToken({
      user_id: foundUser.id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
      fcmToken: fcmToken
    });
    return {
      user: getInforData({
        fileds: ["id", "email"],
        object: foundUser,
      }),
      tokens,
    };
  };
  static handleRefreshToken = async ({ keyStore, user, refreshToken }) => {
    const { user_id, email } = user;
    if (keyStore.refreshTokenUsed.hasOwnProperty(refreshToken)) {
      await KeyTokenService.removeKeyById(user_id);
      throw new ForbiddenError("Something wrong happend!! please relogin");
    }
    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailError("user not registered");
    }
    const tokens = await createTokenPair(
      { user_id, email },
      keyStore.publicKey,
      keyStore.privateKey
    );
    await keyStore.update({
      refreshToken: tokens.refreshToken,
      refreshTokenUsed: refreshToken,
    });
    return {
      user,
      tokens,
    };
  };
  static logout = async (keyStore) => {
    return await KeyTokenService.removeKeyById(keyStore.id);
  };
}

module.exports = AccessService;

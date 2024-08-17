"use strict";

const { BadRequestError, AuthFailError ,ForbiddenError} = require("../../core/error.response");
const db = require("../../models/index.model");
const user = db.User;
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../../auth/authUtils");
const getInforData = require("../../utils/index"); 
const {findByEmail}=require("./user.service")
class AccessService {
  static singUp = async ({ username, password, email }) => {
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
      username,
      password: hashPassword,
      email,
    });

    if (newUser) {
      const publickey = crypto.randomBytes(64).toString("hex");
      const privatekey = crypto.randomBytes(64).toString("hex");
      console.log(publickey, privatekey);
      const userId=newUser.id
      const keyStore = await KeyTokenService.createKeyToken(
        userId,
        publickey,
        privatekey,
    );
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
  static singIn = async ({ email, password, refreshToken = null }) => {
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

    //check match password
    const matchPassword = await bcrypt.compare(password, foundUser.password);

    if (!matchPassword) throw new AuthFailError("password incorrect");
    //create AT and RT and save
    const publicKey = await crypto.randomBytes(64).toString("hex");
    const privateKey = await crypto.randomBytes(64).toString("hex");

    //grenerate tokens
    const tokens = await createTokenPair(
      { userId: foundUser._id, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: foundUser._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });
    return {
      user: getInforData({
        fileds: ["_id", "name", "email"],
        object: foundUser,
      }),
      tokens,
    };
  };
  static handleRefreshToken=async({keyStore,user,refreshToken})=>{
    const {userId,email}=user;
    if(keyStore.refreshTokenUsed.include(refreshToken)){
      await KeyTokenService.removeKeyById(userId);
      throw new ForbiddenError("Something wrong happend!! please relogin");
    }
    if(keyStore.refreshToken!==refreshToken){
      throw new AuthFailError("user not registered");
    }
    const tokens=await createTokenPair(
      {userId,email},
      keyStore.publicKey,
      keyStore.privateKey
    );
    console.log(typeof keyStore);

    await keyStore.updateOne({
      $set:{refreshToken:tokens.refreshToken},
      $addToSet:{
        refreshToken:refreshToken,
      },//đã được sử dụng để lấy token mới
    });
    return {
      user,
      tokens,
    }
  };
  static logOut=async(keyStore)=>{
    const delKey=await KeyTokenService.removeKeyById(keyStore._id);
    console.log(delKey);
    return delKey;
  }
}


module.exports = AccessService;

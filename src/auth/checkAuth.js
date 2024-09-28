"use strict";

const HEADER = {
  API_KEY: "x-api-key",
};

const {findById}=require("../services/Users/apiKey.service")

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden not HEADER error",
      });
    }
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden error",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {
    console.log(error);
  }
};

const permissions = (permissions) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "permissions denied",
      });
    }

    console.log("Permisson:::", req.objKey.permissions);
    const validPermissons = req.objKey.permissions.includes(permissions);
    if (!validPermissons) {
      return res.status(403).json({
        message: "permisson denied",
      });
    }
    return next();
  };
};
module.exports={apiKey,permissions};
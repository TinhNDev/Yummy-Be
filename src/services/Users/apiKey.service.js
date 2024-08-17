"use strict"

const db=require("../../models/index.model")
const apiKeyModel=db.ApiKey
const crypto=require("crypto")
const findById=async(key)=>{
    const objKey=await apiKeyModel.findOne({
        where:{
            key:key,
            status:true
        }
        });
    return objKey;
}

module.exports={findById}
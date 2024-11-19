const { where } = require("underscore");
const db = require("../../models/index.model");
const { CreateAddress } = require("./address.service");
const Profile = db.Profile;
const Address = db.Address;
class ProfileService {
  static UpdateProfile = async ({ user_id, body,email }) => {
    let profile = await Profile.findOne({ where: { user_id: user_id } });
    if (profile) {
        await Profile.update({
        name: body.name,
        image: body.image,
        date: body.date,
        cic:body.cic,
        phone_number: body.phone_number,
        mail: email,
        user_id: user_id,
      },
      {where:{user_id:user_id}}
    );
    } else {
         await Profile.create({
        name: body.name,
        image: body.image,
        date: body.date,
        phone_number: body.phone_number,
        mail: email,
        cic:body.cic,
        user_id: user_id,
      });
    }
    return {
      Profile: await Profile.findOne({ where: { user_id: user_id } }),
    };
  };
  static getProfie = async (user_id) =>{
    return {
      profile:await Profile.findOne({where:{user_id: user_id}}),
    }
  }
}

module.exports = ProfileService;

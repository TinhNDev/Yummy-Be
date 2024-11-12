const { where } = require("underscore");
const db = require("../../models/index.model");
const { CreateAddress } = require("./address.service");
const Profile = db.Profile;
const Address = db.Address;
class ProfileService {
  static UpdateProfile = async ({ user_id, body, address }) => {
    let profile = await Profile.findOne({ where: { user_id: user_id } });
    if (profile) {
        await Profile.update({
        name: body.name,
        image: body.image,
        date: body.date,
        phone_number: body.phone_number,
        mail: body.mail,
        user_id: user_id,
      },
      {where:{id:user_id}}
    );
    } else {
         await Profile.create({
        name: body.name,
        image: body.image,
        date: body.date,
        phone_number: body.phone_number,
        mail: body.mail,
        user_id: user_id,
      });
    }
    if (address) {
      await CreateAddress(address,user_id);
    }
    return {
      profile: await Profile.findOne({ where: { user_id: user_id } }),
      address: await Address.findAll({where:{profileId:user_id}})
    };
  };
  static getProfie = async (user_id) =>{
    return {
      profile:await Profile.findOne({where:{id: user_id}}),
      address: await Address.findAll({where:{profileId:user_id}}),
    }
  }
}

module.exports = ProfileService;

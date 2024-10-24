const db = require("../../models/index.model");
const { CreateAddress } = require("./address.service");
const Profile = db.Profile;
const Address = db.Address;
class ProfileService {
  static UpdateProfile = async ({ user_id, body, address }) => {
    let profile = await Profile.findOne({ where: { user_id: user_id } });
    if (profile) {
      profile = await Profile.update({
        name: body.name,
        image: body.image,
        date: body.date,
        phone_number: body.phone_number,
        mail: body.mail,
        user_id: user_id,
      });
    } else {
      profile = await Profile.create({
        name: body.name,
        image: body.image,
        date: body.date,
        phone_number: body.phone_number,
        mail: body.mail,
        user_id: user_id,
      });
    }
    if (!address) {
      return profile;
    } else {
      const ar  = await CreateAddress(address);
      const addr =await Address.findOne({where: {id : ar.id}});
      return await profile.addAddress(addr);
    }
  };
}

module.exports = ProfileService;

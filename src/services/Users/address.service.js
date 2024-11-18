const db = require("../../models/index.model");
const Address = db.Address;
class AddressService {
  static CreateAddress = async (body,profileId) => {
    return await Address.create({
      id:profileId,
      address_name: body.address_name,
      address_x: body.address_x,
      address_y: body.address_y,
      is_default: body.is_default,
      profileId: profileId
    });
  };

  static SetDefaultAddress = async ({ user_id, address_id }) => {
    const queryN = `
            UPDATE addresses
            SET is_default = 0
            WHERE id IN (
                SELECT AddressId
                FROM \`address profile\`
                WHERE ProfileId = (
                    SELECT id FROM profiles WHERE user_id = ?
                ) 

            )
        `;
    const queryY = `
        UPDATE addresses
        SET is_default = 1
        WHERE id = ?
        AND id IN (
            SELECT AddressId
            FROM \`address profile\`
            WHERE ProfileId = (
                SELECT id FROM profiles WHERE user_id = ?
            )
        )
    `;

    await db.sequelize.query(queryN, {
      replacements: [user_id],
      type: db.Sequelize.QueryTypes.UPDATE,
    });
    return await db.sequelize.query(queryY, {
      replacements: [address_id, user_id],
      type: db.Sequelize.QueryTypes.UPDATE,
    });
  };
}

module.exports = AddressService;

const { Types } = require("mysql2");
const db = require("../../models/index.model");
const keyTokenModel = db.KeyToken;

class KeyTokenService {
  static createKeyToken = async ({
    user_id,
    publicKey,
    privateKey,
    refreshToken,
    fcmToken,
  }) => {
    try {
      const tokensRecord = await keyTokenModel.findOne({
        where: { user_id: user_id },
      });
      let tokens;
      if (tokensRecord) {
        await keyTokenModel.update(
          {
            privateKey: privateKey,
            publicKey: publicKey,
            refreshTokenUsed: {},
            refreshToken: refreshToken,
            fcmToken: fcmToken,
          },
          {
            where: { user_id: user_id },
          }
        );
        tokens = keyTokenModel.findOne({ where: { user_id: user_id } });
      } else {
        tokens = await keyTokenModel.create({
          user_id: user_id,
          privateKey: privateKey,
          publicKey: publicKey,
          refreshToken: refreshToken || "",
          fcmToken: fcmToken,
        });
      }
      return tokens ? tokens : null;
    } catch (error) {
      return error;
    }
  };
  static findByUserId = async (user_id) => {
    return await keyTokenModel.findOne({
      where: {
        user_id: user_id,
      },
    });
  };

  static removeKeyById = async (user_id) => {
    const uI = await keyTokenModel.findOne({ user_id: user_id });
    const deleteTokens = await keyTokenModel.destroy({
      where: { id: uI.id },
    });
    return deleteTokens > 0
      ? { success: true, meesage: "logout succsessfully" }
      : { success: false, meesage: "logout failed" };
  };
}
module.exports = KeyTokenService;

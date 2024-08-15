const AccessService = require("../../services/Users/access.service");
const { CREATE, SuccessResponse } = require("../../core/success.response");

class AccessController {
  //handle signup
  singUp = async (req, res, next) => {
    new CREATE({
      message: "SingUp sucsessfully",
      metadata: await AccessService.singUp(req.body),
      option: {
        limit: 10,
      },
    }).send(res);
  };
}

module.exports = new AccessController();

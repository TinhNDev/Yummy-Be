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

  //handle signin
  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  //handle refresh token
  refreshToken = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.handleRefreshToken(req.body),
    }).send(res);
  };

  //handle Logout
  logOut = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.logOut(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();

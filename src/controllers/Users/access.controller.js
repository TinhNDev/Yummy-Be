const AccessService = require('../../services/Users/access.service');
const { CREATE, SuccessResponse } = require('../../core/success.response');

class AccessController {
  //handle signup
  singUp = async (req, res, next) => {
    new CREATE({
      message: 'SingUp sucsessfully',
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
      metadata: await AccessService.handleRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
        fcmToken: req.fcmToken,
      }),
    }).send(res);
  };

  //handle Logout
  logout = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  //handle forgot password
  forgotPassword = async (req, res) => {
    const { email, password, role, fcmToken } = req.body;
    new SuccessResponse({
      metadata: await AccessService.forgotPassword({
        email,
        password,
        role,
        fcmToken,
      }),
    }).send(res);
  };
}

module.exports = new AccessController();

const { SuccessResponse } = require("../../core/success.response");
const { Categories } = require("../../models/index.model");
const CatergoriesService = require("../../services/Users/categories.service");

class CatergoriesController {
  createCatergories = async (req, res, next) => {
    new SuccessResponse({
      message: "create catergories success",
      metadata: await CatergoriesService.createCategories(req.body),
    });
  };
}
module.exports = CatergoriesController;
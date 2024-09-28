const { SuccessResponse } = require("../../core/success.response");
const { Categories } = require("../../models/index.model");
const CatergoriesService = require("../../services/Users/categories.service");

class CatergoriesController {
  createCatergories = async (req, res, next) => {
    new SuccessResponse({
      message: "create catergories success",
      metadata: await CatergoriesService.createCategories({
        categories: req.body,
      }),
    });
  };
  getListProductById = async (req, res, next) => {
    new SuccessResponse({
      message: "this is list product",
      metadata: await CatergoriesService.getListProduct(),
    }).send(res);
  };
  getProductByCategoryId = async (req, res, next) => {
    new SuccessResponse({
      message: "this is list product",
      metadata: await CatergoriesService.getProductByCategoryId(req.params.id),
    }).send(res);
  };
}
module.exports = new CatergoriesController();

const { SuccessResponse } = require("../../core/success.response");
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
  getAllCategories = async (req, res, next) => {
    new SuccessResponse({
      message: "all categories",
      metadata: await CatergoriesService.getAllCategories(),
    }).send(res);
  };

  getCategoriesByProduct = async (req, res) => {
    new SuccessResponse({
      message: "the categories",
      metadata: await CatergoriesService.getCategoriesByProduct(req.params.id),
    }).send(res);
  };
}
module.exports = new CatergoriesController();

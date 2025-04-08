const { SuccessResponse } = require('../../core/success.response');
const ProductService = require('../../services/Users/product.service');

class ProductController {
  // Tạo sản phẩm mới
  CreateProduct = async (req, res, next) => {
    const { categoriId, toppingData, productData } = req.body;
    const user_id = req.user.user_id;
    console.log(req.user);
    const newProduct = await ProductService.createProduct(
      categoriId,
      toppingData,
      {
        productData,
        user_id,
      }
    );

    new SuccessResponse({
      message: 'Create product success',
      metadata: newProduct,
    }).send(res);
  };

  // Cập nhật sản phẩm
  UpdateProduct = async (req, res, next) => {
    const { categoriId, toppingData, productData } = req.body;
    const user_id = req.user.user_id;
    const product_id = req.params.id;
    const updatedProduct = await ProductService.updateProduct(
      product_id,
      categoriId,
      toppingData,
      {
        productData,
        user_id,
      }
    );

    new SuccessResponse({
      message: 'Update product success',
      metadata: updatedProduct,
    }).send(res);
  };

  // Tìm kiếm sản phẩm theo điều kiện
  GetListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'List of products',
      metadata: await ProductService.getListSearchProduct(req.params),
    }).send(res);
  };

  // Công khai sản phẩm
  PublicProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Publish product by shop success',
      metadata: await ProductService.publishedProductByRestaurant({
        product_id: req.params.id,
        product_restaurant: req.user.user_id,
      }),
    }).send(res);
  };

  // Gỡ bỏ công khai sản phẩm
  DraftProductByRestaurant = async (req, res, next) => {
    new SuccessResponse({
      message: 'Unpublish product by shop success',
      metadata: await ProductService.draftProductByRestaurant({
        product_id: req.params.id,
        product_restaurant: req.user.user_id,
      }),
    }).send(res);
  };

  // Lấy danh sách sản phẩm nháp của cửa hàng
  GetAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list drafts for shop',
      metadata: await ProductService.findAllDraftsForRestaurant({
        product_restaurant: req.user.user_id,
      }),
    }).send(res);
  };

  // Lấy danh sách sản phẩm public
  GetAllPublicForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list public products for shop',
      metadata: await ProductService.findAllPublicForRestaurant({
        product_restaurant: req.user.user_id,
      }),
    }).send(res);
  };

  // Lấy tất cả sản phẩm với điều kiện tìm kiếm
  FindAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'List of products',
      metadata: await ProductService.findAllProduct(req.query),
    }).send(res);
  };

  // Lấy chi tiết của một sản phẩm
  FindProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Product detail',
      metadata: await ProductService.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };

  // Lấy danh sách sản phẩm theo nhà hàng
  getListProductForRes = async (req, res, next) => {
    new SuccessResponse({
      message: 'List Product of Restaurants',
      metadata: await ProductService.getListProductForRes({
        restaurant_id: req.params.restaurant_id,
      }),
    }).send(res);
  };
  // Lấy danh sách sản phẩm theo nhà hàng
  resgetProductByRestaurantIdForUser = async (req, res, next) => {
    new SuccessResponse({
      message: 'List Product of Restaurants',
      metadata: await ProductService.resgetProductByRestaurantIdForUser({
        restaurant_id: req.params.id,
      }),
    }).send(res);
  };
  showProduct = async (req, res) => {
    new SuccessResponse({
      message: 'show product',
      metadata: await ProductService.showProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
  hiddenProduct = async (req, res) => {
    new SuccessResponse({
      message: 'show product',
      metadata: await ProductService.hiddenProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();

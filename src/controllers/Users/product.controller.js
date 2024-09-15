const { SuccessResponse } = require("../../core/success.response");
const ProductService = require("../../services/Users/product.service");

class ProductController {
  // Tạo sản phẩm mới
  CreateProduct = async (req, res, next) => {
    try {
      const { categoriId, toppingId, ...productData } = req.body;
      const user_id = req.user.id;

      const newProduct = await ProductService.createProduct(
        categoriId,
        toppingId,
        {
          ...productData,
          user_id,
        }
      );

      new SuccessResponse({
        message: "Create product success",
        metadata: newProduct,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  // Cập nhật sản phẩm
  UpdateProduct = async (req, res, next) => {
    try {
      const { ...productData } = req.body;
      const user_id = req.user.id;
      const product_id = req.params.id;

      const updatedProduct = await ProductService.updateProduct(product_id, {
        ...productData,
        user_id,
      });

      new SuccessResponse({
        message: "Update product success",
        metadata: updatedProduct,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  // Tìm kiếm sản phẩm theo điều kiện
  GetListSearchProduct = async (req, res, next) => {
    try {
      const { query } = req;
      const listProduct = await ProductService.searchProducts(query);

      new SuccessResponse({
        message: "List of products",
        metadata: listProduct,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  // Công khai sản phẩm
  PublicProductByShop = async (req, res, next) => {
    try {
      const product_id = req.params.id;
      const user_id = req.user.id;

      const publishedProduct = await ProductService.publishProductByShop({
        user_id,
        product_id,
      });

      new SuccessResponse({
        message: "Publish product by shop success",
        metadata: publishedProduct,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  // Gỡ bỏ công khai sản phẩm
  UnPublishProductByShop = async (req, res, next) => {
    try {
      const product_id = req.params.id;
      const user_id = req.user.id;

      const unpublishedProduct = await ProductService.unPublishProductByShop({
        user_id,
        product_id,
      });

      new SuccessResponse({
        message: "Unpublish product by shop success",
        metadata: unpublishedProduct,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  // Lấy danh sách sản phẩm nháp của cửa hàng
  GetAllDraftsForShop = async (req, res, next) => {
    try {
      const user_id = req.user.id;
      const drafts = await ProductService.findAllDraftsForShop(user_id);

      new SuccessResponse({
        message: "Get list drafts for shop",
        metadata: drafts,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  // Lấy danh sách sản phẩm đã công khai của cửa hàng
  GetAllPublishForShop = async (req, res, next) => {
    try {
      const user_id = req.user.id;
      const publishedProducts = await ProductService.findAllPublishForShop(user_id);

      new SuccessResponse({
        message: "Get list published for shop",
        metadata: publishedProducts,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  // Lấy tất cả sản phẩm với điều kiện tìm kiếm
  FindAllProducts = async (req, res, next) => {
    try {
      const query = req.query;
      const products = await ProductService.findAllProducts(query);

      new SuccessResponse({
        message: "List of products",
        metadata: products,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  // Lấy chi tiết của một sản phẩm
  FindProduct = async (req, res, next) => {
    try {
      const product_id = req.params.product_id;
      const product = await ProductService.findProduct(product_id);

      new SuccessResponse({
        message: "Product detail",
        metadata: product,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new ProductController();

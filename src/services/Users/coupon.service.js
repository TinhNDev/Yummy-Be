const db = require('../../models/index.model');
const { Restaurant, Coupon, CouponUsage } = require('../../models/index.model');

class CouponService {
  static getCoupon = async ({ totalCost, user_id, restaurant_id }) => {
    const coupons = await Coupon.findAll({
      where: {
        is_active: true,
      },
    });

    const adminCoupons = [];
    const restaurantCoupons = [];

    for (const coupon of coupons) {
      let error = null;

      try {
        if (coupon.end_date && new Date(coupon.end_date) < new Date()) {
          error = 'Coupon has expired';
        } else if (coupon.min_order_value > totalCost) {
          error = 'Order value does not meet the minimum requirement for this coupon';
        } else if (coupon.coupon_type === 'ONE_TIME') {
          const usage = await CouponUsage.findOne({
            where: { user_id: user_id, coupon_id: coupon.id },
          });
          if (usage) {
            error = 'User has already used this coupon';
          }
        } else if (coupon.coupon_type === 'ONE_TIME_EVERY_DAY') {
          if (coupon.current_uses >= coupon.max_uses_per_user) {
            error = 'Coupon usage limit for today has been reached';
          }
        }
      } catch (err) {
        error = `Error validating coupon: ${err.message}`;
      }

      const item = {
        coupon,
        error,
      };

      if (coupon.restaurant_id === null) {
        adminCoupons.push(item);
      } else {
        restaurantCoupons.push(item);
      }
    }

    return {
      adminCoupons,
      restaurantCoupons,
    };
  };

  static createCoupon = async ({ body }) => {
    const {
      coupon_name,
      coupon_code,
      discount_value,
      discount_type,
      max_discount_amount,
      min_order_value,
      max_uses_per_user,
      start_date,
      end_date,
      is_active,
      coupon_type,
      restaurant_id,
    } = body;

    if (
      !coupon_name ||
      !coupon_code ||
      !discount_value ||
      !start_date ||
      !end_date ||
      !coupon_type
    ) {
      throw new Error('Vui lòng cung cấp đầy đủ thông tin bắt buộc.');
    }

    if (
      discount_value < 0 ||
      (max_discount_amount && max_discount_amount < 0) ||
      (min_order_value && min_order_value < 0)
    ) {
      throw new Error('Giá trị không hợp lệ. Các số phải lớn hơn hoặc bằng 0.');
    }

    if (max_uses_per_user && max_uses_per_user < 1) {
      throw new Error('Số lần sử dụng tối đa phải lớn hơn hoặc bằng 1.');
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new Error('Ngày kết thúc phải lớn hơn ngày bắt đầu.');
    }
    const existingCoupon = await Coupon.findOne({ where: { coupon_code } });
    if (existingCoupon) {
      throw new Error('Mã coupon đã tồn tại.');
    }

    return await Coupon.create({
      coupon_name,
      coupon_code,
      discount_value,
      discount_type,
      max_discount_amount,
      min_order_value,
      max_uses_per_user,
      start_date,
      end_date,
      is_active: is_active !== undefined ? is_active : true,
      coupon_type,
      restaurant_id
    });
  };

  static searchCouponsByName = async ({ name }) => {
    return await Coupon.findAll({
      where: {
        coupon_name: {
          [Op.iLike]: `%${name}%`,
        },
      },
    });
  };

  static getCouponRes = async ({ restaurant_id }) => {
    return await db.Coupon.findAll({
      where: {
        restaurant_id: restaurant_id,
        id: {
          [db.Sequelize.Op.notIn]: db.Sequelize.literal(
            `(SELECT coupon_id FROM flash_sales)`
          ),
        },
      },
      order: [['createdAt', 'ASC']],
    });
  };

  static editCoupon = async ({ restaurant_id, body }) => {
    const { coupon_id, ...updateFields } = body;

    if (!coupon_id) {
      throw new Error('Vui lòng cung cấp coupon_id để chỉnh sửa.');
    }

    const coupon = await db.Coupon.findOne({
      where: {
        id: coupon_id,
        restaurant_id: restaurant_id,
      },
    });

    if (!coupon) {
      throw new Error('Không tìm thấy coupon hoặc coupon không thuộc nhà hàng này.');
    }

    if (updateFields.start_date && updateFields.end_date) {
      if (new Date(updateFields.start_date) >= new Date(updateFields.end_date)) {
        throw new Error('Ngày kết thúc phải lớn hơn ngày bắt đầu.');
      }
    }

    if (updateFields.discount_value && updateFields.discount_value < 0) {
      throw new Error('Giá trị giảm giá phải lớn hơn hoặc bằng 0.');
    }

    if (updateFields.max_discount_amount && updateFields.max_discount_amount < 0) {
      throw new Error('Giá trị giảm giá tối đa phải lớn hơn hoặc bằng 0.');
    }

    if (updateFields.min_order_value && updateFields.min_order_value < 0) {
      throw new Error('Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 0.');
    }

    if (updateFields.max_uses_per_user && updateFields.max_uses_per_user < 1) {
      throw new Error('Số lần sử dụng tối đa phải lớn hơn hoặc bằng 1.');
    }

    await coupon.update(updateFields);

    return coupon;
  };

  static createFlashSale = async ({ body, product_id }) => {
    const coupon = await this.createCoupon({ body });

    const product = await db.Product.findOne({ where: { id: product_id } });
    if (!product) {
      throw new Error('Không tìm thấy sản phẩm.');
    }

    let totalDiscount;

    if (body.discount_type === 'PERCENTAGE') {
      totalDiscount = product.price - (product.price * coupon.discount_value / 100);
    } else if (body.discount_type === 'FIXED_AMOUNT') {
      totalDiscount = product.price - coupon.discount_value;
    } else {
      throw new Error('Loại giảm giá không hợp lệ.');
    }

    if (totalDiscount < 0) totalDiscount = 0;

    return await db.FlashSale.create({
      coupon_id: coupon.id,
      product_id,
      amount: totalDiscount,
    });
  }

  static createListFlashSale = async ({ body }) => {
    const { couponDetails, products } = body;

    if (!couponDetails || !products || !Array.isArray(products) || products.length === 0) {
      throw new Error('Vui lòng cung cấp thông tin coupon và danh sách sản phẩm.');
    }

    const coupon = await this.createCoupon({ body: couponDetails });

    const flashSales = [];
    for (const product of products) {
      const { product_id } = product;
      const products = await db.Product.findOne({ where: { id: product_id } });
      let totalDiscount;

      if (body.discount_type === 'PERCENTAGE') {
        totalDiscount = products.price - (products.price * coupon.discount_value / 100);
      } else if (body.discount_type === 'FIXED_AMOUNT') {
        totalDiscount = products.price - coupon.discount_value;
      } else {
        throw new Error('Loại giảm giá không hợp lệ.');
      }

      const flashSale = await db.FlashSale.create({
        coupon_id: coupon.id,
        product_id: product_id,
        amount: totalDiscount,
      });

      flashSales.push(flashSale);
    }

    return flashSales;
  };
  static getProductForFlashSale = async ({ restaurant_id }) => {
    const query = `
      SELECT
        c.id AS coupon_id,
        c.coupon_type,
        c.coupon_name,
        c.coupon_code,
        c.discount_value,
        c.discount_type,
        c.max_discount_amount,
        c.min_order_value,
        c.max_uses_per_user,
        c.start_date,
        c.end_date,
        c.is_active,
        p.id AS product_id,
        p.name AS product_name,
        p.price AS product_price,
        fl.id AS flash_sale_id
      FROM Products p
      JOIN flash_sales fl ON p.id = fl.product_id
      JOIN coupons c ON c.id = fl.coupon_id
      WHERE p.restaurant_id = :restaurant_id;
    `;

    const rawData = await db.sequelize.query(query, {
      replacements: { restaurant_id },
      type: db.Sequelize.QueryTypes.SELECT,
      raw: true,
    });

    const formattedData = rawData.reduce((acc, item) => {
      const existingCoupon = acc.find(coupon => coupon.id === item.coupon_id);

      if (existingCoupon) {
        existingCoupon.food_items.push({
          product_id: item.product_id,
          product_name: item.product_name,
          product_price: item.product_price,
        });
      } else {
        acc.push({
          id: item.coupon_id,
          coupon_type: item.coupon_type,
          coupon_name: item.coupon_name,
          coupon_code: item.coupon_code,
          discount_value: item.discount_value,
          discount_type: item.discount_type,
          max_discount_amount: item.max_discount_amount,
          min_order_value: item.min_order_value,
          max_uses_per_user: item.max_uses_per_user,
          start_date: item.start_date,
          end_date: item.end_date,
          is_active: item.is_active,
          flash_sale_id: item.flash_sale_id,
          food_items: [
            {
              product_id: item.product_id,
              product_name: item.product_name,
              product_price: item.product_price,
            },
          ],
        });
      }

      return acc;
    }, []);

    return formattedData;
  };

  static editFlashSale = async ({ restaurant_id, body }) => {
    const { coupon_id, flash_sale_id, add_products = [], remove_products = [], ...couponFields } = body;

    if (!coupon_id || !flash_sale_id) {
      throw new Error('Vui lòng cung cấp coupon_id và flash_sale_id để chỉnh sửa.');
    }

    await this.editCoupon({ restaurant_id, body: { coupon_id, ...couponFields } });

    const flashSale = await db.FlashSale.findOne({
      where: {
        id: flash_sale_id,
        coupon_id,
      },
    });

    if (!flashSale) {
      throw new Error('Không tìm thấy flash sale hoặc thông tin không hợp lệ.');
    }

    if (remove_products.length > 0) {
      await db.FlashSale.destroy({
        where: {
          coupon_id,
          product_id: {
            [db.Sequelize.Op.in]: remove_products,
          },
        },
      });
    }
    let totalDiscount;
    for (const product_id of add_products) {
      const product = await db.Product.findOne({ where: { id: product_id } });
      if (!product) {
        throw new Error(`Sản phẩm với ID ${product_id} không tồn tại.`);
      }

      const exists = await db.FlashSale.findOne({
        where: {
          coupon_id,
          product_id,
        },
      });

      if (body.discount_type === 'PERCENTAGE') {
        totalDiscount = product.price - (product.price * body.discount_value / 100);
      } else if (body.discount_type === 'FIXED_AMOUNT') {
        totalDiscount = product.price - product.discount_value;
      } else {
        throw new Error('Loại giảm giá không hợp lệ.');
      }

      if (!exists) {
        await db.FlashSale.create({
          coupon_id,
          product_id,
          amount: totalDiscount ?? 0,
        });
      }
    }

    if (totalDiscount !== undefined) {
      if (totalDiscount < 0) {
        throw new Error('Số lượng giảm giá phải lớn hơn hoặc bằng 0.');
      }
      flashSale.amount = totalDiscount;
      await flashSale.save();
    }

    const updatedFlashSales = await db.FlashSale.findAll({
      where: { coupon_id },
    });

    return updatedFlashSales;
  };

}

module.exports = CouponService;

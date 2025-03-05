const { Restaurant, Coupon } = require("../../models/index.model");

class CouponService {
  static getCoupon = async () => {
    return await Coupon.findAll();
  };
  // static createCoupon = async ({restaurant_id,body})=>{
  //     const restaurant = Restaurant.findOne({where:{profile_id: restaurant_id}});
  //     return await Restaurant.create({
  //         coupon_code:body.coupon_code,
  //         price: body.price,
  //         amount : body.amount,
  //         restaurant_id: restaurant.id
  //     })
  // }

  static addCouponToOrder = async (coupon_id) => {
    const coupon = await Coupon.findOne({ where: { id: coupon_id } });
    return await Coupon.update(
      {
        where: coupon.id,
      },
      {
        amount: coupon.amount - 1,
      }
    );
  };
}

module.exports = CouponService;

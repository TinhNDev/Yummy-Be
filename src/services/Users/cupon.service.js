const { Restaurant, Cupon } = require("../../models/index.model")

class CuponService{
    static getCupon = async () =>{
        return await Cupon.fildAll();
    }
    // static createCupon = async ({restaurant_id,body})=>{
    //     const restaurant = Restaurant.findOne({where:{profile_id: restaurant_id}});
    //     return await Restaurant.create({
    //         cupon_code:body.cupon_code,
    //         price: body.price,
    //         amount : body.amount,
    //         restaurant_id: restaurant.id
    //     })
    // }

    static addCuponToOrder = async (cupon_id) =>{
        const cupon = await Cupon.findOne({where:{id:cupon_id}});
        return await Cupon.update({
            where:cupon.id
        },{
            amount: cupon.amount -1,
        })
    }
}

module.exports = CuponService;
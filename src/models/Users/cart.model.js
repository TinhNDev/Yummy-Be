<<<<<<< HEAD
module.exports = (sequelize, Sequelize) =>{
    const Cart = sequelize.define("Cart",{
        listCartItem: {
            type: Sequelize.JSON
        },
    })
    return Cart;
=======
module.exports = (sequelize, Sequelize) =>{
    const Cart = sequelize.define("Cart",{
        listCartItem: {
            type: Sequelize.JSON
        },
    })
    return Cart;
>>>>>>> ba1ec96e9f13d8946d170ae05d9691d1754d1aa7
}
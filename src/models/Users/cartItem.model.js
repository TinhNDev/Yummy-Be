<<<<<<< HEAD
module.exports = (sequelize, Sequelize) => {
    const CartItem = sequelize.define("Cart Item",{
        product:{
            type: Sequelize.JSON
        },
        quantity: {
            type: Sequelize.INTEGER,
        },
        price:{
            type: Sequelize.DECIMAL
        }
    })
    return CartItem;
=======
module.exports = (sequelize, Sequelize) => {
    const CartItem = sequelize.define("Cart Item",{
        product:{
            type: Sequelize.JSON
        },
        quantity: {
            type: Sequelize.INTEGER,
        },
        price:{
            type: Sequelize.DECIMAL
        }
    })
    return CartItem;
>>>>>>> ba1ec96e9f13d8946d170ae05d9691d1754d1aa7
}
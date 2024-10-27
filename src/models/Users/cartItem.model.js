module.exports = (sequelize, Sequelize) => {
    const CartItem = sequelize.define("Cart Item",{
        product:{
            type: Sequelize.JSON
        },
        quanlity: {
            type: Sequelize.INTEGER,
        },
        price:{
            type: Sequelize.DECIMAL
        }
    })
    return CartItem;
}
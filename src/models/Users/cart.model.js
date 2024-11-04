module.exports = (sequelize, Sequelize) =>{
    const Cart = sequelize.define("Cart",{
        listCartItem: {
            type: Sequelize.JSON
        },
    })
    return Cart;
}
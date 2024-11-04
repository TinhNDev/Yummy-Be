module.exports = (sequelize, Sequelize) =>{
    const OrderItem = sequelize.define("Order Item", {
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
    return OrderItem;
}
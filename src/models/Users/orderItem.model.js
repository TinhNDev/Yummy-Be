module.exports = (sequelize, Sequelize) =>{
    const OrderItem = sequelize.define("Oder Item", {
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
    return OrderItem;
}
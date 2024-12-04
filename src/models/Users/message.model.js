module.exports = (sequelize, Sequelize) =>{
    const Message = sequelize.define("Message",{
        text: Sequelize.TEXT,
        productId: Sequelize.STRING,
        type: {
            type: Sequelize.ENUM,
            values: ["bot", "user"]
        }
    })
    return Message;
}
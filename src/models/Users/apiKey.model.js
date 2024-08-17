module.exports=(sequelize,Sequelize)=>{
    const apiKey=sequelize.define("Api Key",{
        key:{
            type:Sequelize.STRING,
        },
        status:{
            type:Sequelize.BOOLEAN,
        },
        permissions:{
            type:   Sequelize.ENUM,
            values: ["0000", "1111", "2222"]
        }
    })
    return apiKey;
}
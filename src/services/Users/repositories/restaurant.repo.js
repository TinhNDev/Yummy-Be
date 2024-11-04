const db = require("../../../models/index.model")

const findRestauranByKeyWord = async(keySearch)=>{
    const query = `
    SELECT * FROM Restaurant
    WHERE status = 'active'
    AND name LIKE ?
    ORDER BY createdAt DESC;
    `
    return await db.sequelize.query(query,{
        replacement:[`${keySearch}`],
        type: db.Sequelize.QueryTypes.SELECT,
    })
}

module.exports = {findRestauranByKeyWord}
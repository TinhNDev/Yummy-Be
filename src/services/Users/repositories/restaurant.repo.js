const db = require("../../../models/index.model")
const {calculateDistance} = require("../../../helper/distance")
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
const sortRestaurantsByDistance = async (restaurants, userLatitude, userLongitude) => {
    return await restaurants
      .map(restaurant => {
        const [address_x, address_y] = restaurant.address.split(",");
        const distance = calculateDistance(userLatitude, userLongitude, parseFloat(address_x), parseFloat(address_y));
        return { ...restaurant, distance };
      })
      .sort((a, b) => a.distance - b.distance);
  }

module.exports = {findRestauranByKeyWord,sortRestaurantsByDistance}
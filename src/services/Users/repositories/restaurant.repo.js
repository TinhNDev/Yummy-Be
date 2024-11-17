const db = require("../../../models/index.model")
const geolib = require("geolib");
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
const getNearbyRestaurantDetails = (
  restaurants,
  userLatitude,
  userLongitude,
  radius
) => {
  return (
    restaurants
      .map((restaurant) => {
        const distance = geolib.getDistance(
          { latitude: userLatitude, longitude: userLongitude },
          { latitude: restaurant.address_x, longitude: restaurant.address_y }
        );
        return {
          id: restaurant.id,
          name: restaurant.name,
          description: restaurant.description,
          image: restaurant.image,
          distance: distance,
          inRadius: distance <= radius,
        };
      })
      .filter((restaurant) => restaurant.inRadius)
      .sort((a, b) => a.distance - b.distance)
  );
};

module.exports = {findRestauranByKeyWord,getNearbyRestaurantDetails}


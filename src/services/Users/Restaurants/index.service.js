const { Restaurant, Order, Driver, Profile } = require("../../../models/index.model");
const geolib = require('geolib');
const redis = require('redis');
const getAllDriverIdsFromRedis = require("../../../helper/redisFunction");

const redisClient = redis.createClient();

class OrderRestaurantService {
    static getOrder = async ({ restaurant_id }) => {
        return Order.findAll({ where: { restaurant_id } });
    };

    static changeStatusOrder = async ({ orderId, status }) => {
        const order = await Order.findByPk(orderId);
        if (order) {
            order.order_status = status;
            await order.save();
            return order;
        } else {
            throw new Error(`Order with ID ${orderId} not found`);
        }
    };
    
    static findDriver = async ({restaurant_id, order_id}) => {
        try {
            if (!redisClient.isOpen) {
                await redisClient.connect();
            }

            const restaurant = await Restaurant.findByPk(restaurant_id);
            if (!restaurant) throw new Error('Restaurant not found');

            const order = await Order.findByPk(order_id);
            if (!order) throw new Error('Order not found');

            const driverIds = await getAllDriverIdsFromRedis();
            let nearestDriver = null;
            let shortestDistance = Infinity;

            for (const driverId of driverIds) {
                const driverLocation = await redisClient.hGetAll(`driver:${driverId}:location`);

                if (driverLocation && driverLocation.latitude && driverLocation.longitude) {
                    const driverCoords = {
                        latitude: parseFloat(driverLocation.latitude),
                        longitude: parseFloat(driverLocation.longitude)
                    };
                    const restaurantCoords = {
                        latitude: parseFloat(restaurant.dataValues.address_x),
                        longitude: parseFloat(restaurant.dataValues.address_y)
                    };

                    const distance = geolib.getDistance(driverCoords, restaurantCoords);

                    if (distance < shortestDistance) {
                        shortestDistance = distance;
                        nearestDriver = driverId;
                    }
                }
            }

            if (nearestDriver) {
                order.dataValues.driver_id = nearestDriver;
                const place_lisence = await Driver.findOne({where:{id:parseFloat(1)}})
                const profile =  await Profile.findOne({where:{id:parseFloat(1)}})
                socket.emit("newOrderForDriver", {
                    orderId: newOrder.id,
                    restaurant_id: orderData.driver_id,
                  });
                return {
                    order:{
                        order: order.dataValues,
                        profile: profile?.dataValues||{},
                        license_plate: place_lisence?.dataValues.license_plate || {}
                    }
                }
            } else {
                throw new Error('No available driver found');
            }
        } catch (error) {
            console.error('Error in findDriver:', error.message);
            throw new Error('Could not find driver');
        }
    };
}

module.exports = OrderRestaurantService;

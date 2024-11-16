const {
  Restaurant,
  Order,
  Driver,
  Profile,
  sequelize,
  User,
  KeyToken,
} = require("../../../models/index.model");
const geolib = require("geolib");
const redis = require("redis");
const getAllDriverIdsFromRedis = require("../../../helper/redisFunction");
const { io } = require("socket.io-client");
const socket = io(process.env.SOCKET_SERVER_URL);
const admin = require("firebase-admin");
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

  static findDriver = async ({ restaurant_id, order_id }) => {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }

      const restaurant = await Restaurant.findByPk(restaurant_id);
      if (!restaurant) throw new Error("Restaurant not found");

      const order = await Order.findByPk(order_id);
      if (!order) throw new Error("Order not found");

      const driverIds = await getAllDriverIdsFromRedis();
      let nearestDriver = null;
      let shortestDistance = Infinity;

      for (const driverId of driverIds) {
        const driverLocation = await redisClient.hGetAll(
          `driver:${driverId}:location`
        );

        if (
          driverLocation &&
          driverLocation.latitude &&
          driverLocation.longitude
        ) {
          const driverCoords = {
            latitude: parseFloat(driverLocation.latitude),
            longitude: parseFloat(driverLocation.longitude),
          };
          const restaurantCoords = {
            latitude: parseFloat(restaurant.dataValues.address_x),
            longitude: parseFloat(restaurant.dataValues.address_y),
          };

          const distance = geolib.getDistance(driverCoords, restaurantCoords);

          if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestDriver = driverId;
          }
        }
      }

      if (nearestDriver) {
        const transaction = await sequelize.transaction();

        try {
          await Order.update(
            { driver_id: nearestDriver, order_status:'PREPARING_ORDER' },
            { where: { id: order.dataValues.id }, transaction }
          );
          const updatedOrder = await Order.findOne({
            where: { id: order.dataValues.id },
            include: [
              {
                model: Restaurant,
                attributes: ["id", "name", "address"],
              },
              {
                model: Driver,
                attributes: ["license_plate"],
                include: [
                  {
                    model: Profile,
                    as: "Profile",
                    attributes: ["id", "name", "image", "phone_number", "cic"],
                    include: [
                      {
                        model: User,
                        as: "User",
                        include: [
                          {
                            model: KeyToken,
                            as: "Key Tokens",
                            attributes: ["fcmToken"],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
            transaction,
          });
          await transaction.commit();
          try {
            const fcmToken =
              updatedOrder?.Driver?.Profile?.User?.['Key Tokens']?.[0]?.fcmToken;
            if (fcmToken) {
              const payload = {
                notification: {
                  title: "New Order",
                  body: `Bạn có đơn hàng mới!`,
                },
                token: fcmToken,
              };

              const response = await admin.messaging().send(payload);
              console.log("Successfully sent message:", response);
            } else {
              console.log("FCM token not found");
            }
          } catch (error) {
            console.error("Error sending notification:", error);
          }
          socket.emit("newOrderForDriver", {
            data: updatedOrder?.dataValues,
          });

          return {
            order: updatedOrder,
          };
        } catch (error) {
          if (!transaction.finished) {
            await transaction.rollback();
          }
          throw error;
        }
      } else {
        throw new Error("No available driver found");
      }
    } catch (error) {
      console.error("Error in findDriver:", error.message);
      throw new Error("Could not find driver");
    }
  };
}

module.exports = OrderRestaurantService;

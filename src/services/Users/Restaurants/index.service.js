const { Restaurant, Order } = require("../../../models/index.model")
const geolib = require('geolib');
const redis = require('redis');
const { promisify } = require('util');
const redisClient = redis.createClient();
const hGetAllAsync = promisify(redisClient.hGetAll).bind(redisClient);
const getAllDriverIdsFromRedis = require("../../../helper/redisFunction")
class OrderRestaunrantService{
    static getOrder = async({restaurant_id}) =>{
        return Order.findAll({where:{restaurant_id: restaurant_id}});
    }

    static changeStatusOrder = async({orderId, status}) =>{
        const order = await db.Order.findByPk(orderId);
        if (order) {
            order.status = status;
            await order.save();
            return order;
        }
    }
    
    static findDriver = async (restaurant_id, order_id) => {
        try {
          // Lấy thông tin nhà hàng từ database
          const restaurant = await Restaurant.findByPk(restaurant_id);
          if (!restaurant) {
            throw new Error('Restaurant not found');
          }
    
          // Lấy thông tin đơn hàng từ database
          const order = await Order.findByPk(order_id);
          if (!order) {
            throw new Error('Order not found');
          }
    
          // Lấy tất cả các tài xế từ Redis, với giả sử key format là driver:{id}:location
          const driverIds = await getAllDriverIdsFromRedis();  // Hàm này có thể quét tất cả các driver trong Redis, ví dụ: driver:1:location, driver:2:location, v.v.
    
          let nearestDriver = null;
          let shortestDistance = Infinity;
    
          // Duyệt qua từng tài xế để tìm tài xế gần nhất
          for (const driverId of driverIds) {
            const driverLocation = await hGetAllAsync(`driver:${driverId}:location`);
    
            // Kiểm tra nếu dữ liệu tài xế tồn tại trong Redis
            if (driverLocation && driverLocation.latitude && driverLocation.longitude) {
              const driverCoords = {
                latitude: parseFloat(driverLocation.latitude),
                longitude: parseFloat(driverLocation.longitude)
              };
    
              const restaurantCoords = {
                latitude: restaurant.latitude,
                longitude: restaurant.longitude
              };
    
              // Tính khoảng cách giữa tài xế và nhà hàng
              const distance = geolib.getDistance(driverCoords, restaurantCoords);
    
              // Nếu tài xế này gần hơn thì cập nhật tài xế gần nhất
              if (distance < shortestDistance) {
                shortestDistance = distance;
                nearestDriver = driverId;
              }
            }
          }
    
          if (nearestDriver) {
            return nearestDriver;
          } else {
            throw new Error('No available driver found');
          }
        } catch (error) {
          console.error('Error in findDriver:', error.message);
          throw new Error('Could not find driver');
        }
      };
    //gửi đơn cho tài xế gần đó
    //thiết lập các thông báo
    //quản lý hoàn tiền huy đơn
}
     
module.exports = OrderRestaunrantService
const axios = require('axios')
const calculateDistance = async (originsLat, originsLng, destinationLat, destinationLng) => {
  try {
    const response = await axios.get(process.env.DISTANCE_URL, {
      params: {
        origins: `${originsLat},${originsLng}`,
        destinations: `${destinationLat},${destinationLng}`,
        key: process.env.DISTANCE_API_KEY,
      },
    });

    const data = response.data;
    if (data.rows && data.rows[0].elements[0]) {
      const distance = data.rows[0].elements[0].distance.text;  // Khoảng cách
      const duration = data.rows[0].elements[0].duration.text;  // Thời gian di chuyển
      return { distance, duration };
    } else {
      return { distance: 'N/A', duration: 'N/A' }; // Nếu không có dữ liệu
    }
  } catch (error) {
    console.error('Error fetching distance matrix data:', error);
    return { distance: 'Error', duration: 'Error' }; // Nếu có lỗi xảy ra
  }
};


module.exports = calculateDistance;
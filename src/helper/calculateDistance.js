const axios = require('axios');

const calculateDistance = async (
  originsLat,
  originsLng,
  destinationLat,
  destinationLng
) => {
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
      let distanceText = data.rows[0].elements[0].distance.text;
      const duration = data.rows[0].elements[0].duration.text;
      let distanceInKm;
      if (distanceText.includes('km')) {
        distanceInKm = parseFloat(distanceText.replace(' km', ''));
      } else if (distanceText.includes('m')) {
        const distanceInMeters = parseFloat(distanceText.replace(' m', ''));
        distanceInKm = (distanceInMeters / 1000).toFixed(2);
      }

      return {
        distance: `${distanceInKm} km`,
        duration,
      };
    } else {
      return { distance: 'N/A', duration: 'N/A' }; // Nếu không có dữ liệu
    }
  } catch (error) {
    console.error('Error fetching distance matrix data:', error);
    return { distance: 'Error', duration: 'Error' }; // Nếu có lỗi xảy ra
  }
};

module.exports = calculateDistance;

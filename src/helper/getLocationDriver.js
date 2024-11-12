const axios = require('axios')
function notifyAddressUpdate(addressData) {
  axios
    .post("http://localhost:3002/updateAddress", addressData)
    .then((response) => {
      console.log("Address update sent successfully:", response.data);
    })
    .catch((error) => {
      console.error("Error sending address update:", error);
    });
}

module.exports =  notifyAddressUpdate

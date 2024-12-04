const processChatData = (chatArray) => {
    const userMessages = [];
    const botMessages = [];
    let productItems = [];
  
    chatArray.forEach((item) => {
      if (item.type === "user") {
        userMessages.push(item.text);
      } else if (item.type === "bot") {
        botMessages.push(item.text);
      } else if (item.type === "products") {
        productItems = item.items || [];
      }
    });
  
    return {
      userMessages,
      botMessages,
      productItems,
    };
  };
module.exports = {processChatData}  
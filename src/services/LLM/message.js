const { Message, Product } = require("../../models/index.model");

class MessageService {
  static saveHistoryMessage = async ({ user_id, message }) => {
    let mess = await Message.findAll({ where: { user_id: user_id } });
    for (const item of message) {
      if (item.type === "user" || item.type === "bot") {
        mess = await Message.create({
          text: item.text,
          type: item.type,
          user_id: user_id,
        });
      }
      if (item.type === "products" && item.items && item.items.length > 0) {
        let productIds = item.items.join(",");
        await Message.update(
          { productId: productIds },
          { where: { id: mess.id } }
        );
      }
    }
    return mess;
  };

  static async getChatHistory(user_id) {
    const messages = await Message.findAll({
      where: { user_id: user_id },
      order: [["createdAt", "ASC"]],
    });

    if (messages.length === 0) {
      return [];
    }

    const productIds = [];
    messages.forEach((msg) => {
      if (msg.productId) {
        productIds.push(
          ...msg.productId.split(",").map((id) => parseInt(id, 10))
        );
      }
    });

    const uniqueProductIds = [...new Set(productIds)];

    const products = await Product.findAll({
      where: {
        id: uniqueProductIds,
      },
    });

    const chatHistory = [];

    messages.forEach((msg) => {
      if (msg.type === "user") {
        chatHistory.push({ text: msg.text, type: "user" });
      } else if (msg.type === "bot") {
        const messageData = { text: msg.text, type: "bot" };
        chatHistory.push(messageData);
      }

      if (msg.productId) {
        chatHistory.push({
          type: "products",
          items: msg.productId
            .split(",")
            .map((id) => {
              return products.find(
                (product) => product.id === parseInt(id, 10)
              );
            })
            .filter(Boolean),
        });
      }
    });

    chatHistory.forEach((message) => {
      if (message.products && message.products.items) {
        message.products.items = message.products.items.map((item) => [item]);
      }
    });

    return chatHistory || [];
  }
}

module.exports = MessageService;

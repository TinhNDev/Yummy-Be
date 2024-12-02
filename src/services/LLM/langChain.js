const { Groq } = require('groq-sdk');
const db = require("../../models/index.model");
const foodMapping = {
  "pho": "Phở",
  "burger": "Bánh mì kẹp thịt",
  "pizza": "Pizza",
  "sushi": "Sushi",
  "ramen": "Mì ramen",
  "pasta": "Mỳ Ý",
  "salad": "Salad",
  "coffee": "Cà phê",
  "tea": "Trà",
  "dessert": "Món tráng miệng"
};

class IntelligentSearch {
  constructor() {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  async analyzeIntent(query) {
    try {
      const normalizedQuery = query.toLowerCase().trim();
      const intent = foodMapping[normalizedQuery];

      if (intent) {
        return intent;
      }
      const response = await this.groq.chat.completions.create({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: `Bạn là trợ lý phân tích từ khóa tìm kiếm món ăn. Hãy xác định ý định tìm kiếm từ từ khóa sau: "${query}"`
          },
          {
            role: 'user',
            content: `Từ khóa: ${query}. 
            Chỉ cần trả về tên món ăn tiếng Việt chính xác từ từ khóa này,không cần tên cụ thể ví dụ "Bánh mì giòn" chỉ cần trả lời "Bánh mì" và đừng giải thích gì thêm. Ví dụ: 
            - Nếu từ khóa là "pho" hoặc "phở" thì trả về "Phở"
            - Nếu từ khóa là "burger" thì trả về "Bánh mì kẹp thịt"
            - Nếu từ khóa là "bread" thì trả về "Bánh mì"
            - Nếu từ khóa là "pizza" thì trả về "Pizza"`
          }
          
        ]
      });

      return response.choices[0]?.message?.content || null;
    } catch (error) {
      console.error("Lỗi phân tích ý định:", error);
      return null;
    }
  }
  async searchProductByIntent(intent) {
    try {
      const products = await db.Product.findAll({
        where: {
          name: { [db.Sequelize.Op.like]: `%${intent}%` }
        },
        limit: 5
      });

      return products;
    } catch (error) {
      console.error("Lỗi tìm kiếm sản phẩm:", error);
      return [];
    }
  }
  async handleSearch(query) {
    try {
      const intent = await this.analyzeIntent(query);
      if (!intent) {
        return { message: "Không thể xác định ý định tìm kiếm" };
      }
      const products = await this.searchProductByIntent(intent);
      return { 
        intent: intent,
        products: products 
      };
    } catch (error) {
      console.error("Lỗi xử lý tìm kiếm:", error);
      return { message: "Đã xảy ra lỗi trong quá trình tìm kiếm" };
    }
  }
}

module.exports = new IntelligentSearch();

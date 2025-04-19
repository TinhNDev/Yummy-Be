require('dotenv').config();

const { ChatOpenAI } = require('@langchain/openai');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { Op } = require('sequelize');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const db = require('../../models/index.model');

async function analyzeVietnameseQuery() {
  const prompt = ChatPromptTemplate.fromMessages([
    {
      role: 'system',
      content: `Bạn là một hệ thống phân tích câu hỏi về món ăn Việt Nam.
Hãy trích xuất các từ khóa tìm kiếm về món ăn từ câu hỏi của người dùng.
Trả về một đối tượng JSON với các thuộc tính sau:
- tenMonAn: mảng các tên món ăn hoặc từ khóa cụ thể để tìm kiếm
- moTa: mảng các từ khóa mô tả món ăn để tìm trong trường descriptions
- nhaHang: mảng các tên nhà hàng nếu được đề cập (dùng để lọc theo restaurant_id)
- mucGia: đối tượng với giá min và max nếu khoảng giá được đề cập (null nếu không đề cập)
- sapXepTheo: chuỗi chỉ định lựa chọn sắp xếp ("gia_tang", "gia_giam", "moi_nhat", "pho_bien") hoặc null nếu không đề cập`
    },
    {
      role: 'human',
      content: '{question}'
    }
  ]);

  const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-3.5-turbo',
    temperature: 0,
    responseFormat: { type: "json_object" }
  });

  const outputParser = new StringOutputParser();

  const chain = prompt.pipe(model).pipe(outputParser);

  return chain;
}

async function handleSearch(query) {
  try {
    const analyzer = await analyzeVietnameseQuery();
    const analysisResult = await analyzer.invoke({ question: query });

    console.log('Kết quả phân tích:', analysisResult);

    const searchParams = JSON.parse(analysisResult);

    const whereConditions = {
      is_public: true,
      is_available: true,
      is_draft: false
    };

    const orConditions = [];

    if (searchParams.tenMonAn && searchParams.tenMonAn.length > 0) {
      searchParams.tenMonAn.forEach(term => {
        orConditions.push({
          name: { [Op.like]: `%${term}%` }
        });
      });
    }

    if (searchParams.moTa && searchParams.moTa.length > 0) {
      searchParams.moTa.forEach(term => {
        orConditions.push({
          descriptions: { [Op.like]: `%${term}%` }
        });
      });
    }

    if (orConditions.length > 0) {
      whereConditions[Op.or] = orConditions;
    }

    if (searchParams.nhaHang && searchParams.nhaHang.length > 0) {
      const restaurantNames = searchParams.nhaHang;
      const restaurants = await db.Restaurant.findAll({
        where: {
          name: {
            [Op.or]: restaurantNames.map(name => ({ [Op.like]: `%${name}%` }))
          }
        },
        attributes: ['id']
      });

      if (restaurants.length > 0) {
        whereConditions.restaurant_id = {
          [Op.in]: restaurants.map(r => r.id)
        };
      }
    }

    if (searchParams.mucGia) {
      whereConditions.price = {};
      if (searchParams.mucGia.min !== null) {
        whereConditions.price[Op.gte] = searchParams.mucGia.min;
      }
      if (searchParams.mucGia.max !== null) {
        whereConditions.price[Op.lte] = searchParams.mucGia.max;
      }
    }

    let orderOptions = [];
    if (searchParams.sapXepTheo) {
      switch (searchParams.sapXepTheo) {
        case 'gia_tang':
          orderOptions.push(['price', 'ASC']);
          break;
        case 'gia_giam':
          orderOptions.push(['price', 'DESC']);
          break;
        case 'moi_nhat':
          orderOptions.push(['createdAt', 'DESC']);
          break;
        case 'pho_bien':
          orderOptions.push(['quantity', 'DESC']);
          break;
      }
    } else {
      orderOptions.push(['createdAt', 'DESC']);
    }

    const findOptions = {
      where: whereConditions,
      limit: 10,
      order: orderOptions
    };

    console.log('SQL Query options:', JSON.stringify(findOptions, null, 2));

    const products = await db.Product.findAll(findOptions);

    console.log(`Tìm thấy ${products.length} món ăn`);

    const responsePrompt = ChatPromptTemplate.fromMessages([
      {
        role: 'system',
        content: `Bạn là một chuyên gia ẩm thực Việt Nam. Dựa trên kết quả tìm kiếm, hãy cung cấp một mô tả ngắn gọn về các món ăn này. 
        Bọc mỗi tên món ăn trong dấu ngoặc kép. Giữ phản hồi của bạn dưới 30 từ bằng tiếng Việt.`
      },
      {
        role: 'human',
        content: `Các món ăn tìm thấy: ${products.map(p => p.name).join(', ')}. Câu hỏi là: ${query}`
      }
    ]);

    const model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-3.5-turbo',
      temperature: 0
    });

    const description = await responsePrompt.pipe(model).pipe(new StringOutputParser()).invoke({});

    if (products.length > 0) {
      return {
        product: products,
        description: description
      };
    } else {
      return {
        product: null,
        description: 'Không tìm thấy món ăn phù hợp với yêu cầu của bạn. Bạn có thể thử tìm kiếm với từ khóa khác.'
      };
    }
  } catch (error) {
    console.error('Lỗi trong quá trình tìm kiếm:', error.message);
    throw new Error('Tìm kiếm thất bại.');
  }
}

module.exports = { handleSearch };
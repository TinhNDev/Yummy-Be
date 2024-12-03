require("dotenv").config();

const { OpenAIEmbeddings, ChatOpenAI } = require("@langchain/openai");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { Document } = require("@langchain/core/documents");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { Op } = require('sequelize');
const {
  RunnableLambda,
  RunnableMap,
  RunnablePassthrough,
} = require("@langchain/core/runnables");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const db = require("../../models/index.model");

async function setupLangChain() {
  const products = await db.Product.findAll();

  const documents = products.map(
    (product) =>
      new Document({
        pageContent: `${product.name}`,
      })
  );

  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
    batchSize: 512,
    model: "text-embedding-ada-002",
  });

  const vectorstore = await MemoryVectorStore.fromDocuments(
    documents,
    embeddings
  );

  const retriever = vectorstore.asRetriever(1);

  const prompt = ChatPromptTemplate.fromMessages([
    {
      role: "ai",
      content: "Theo tôi nghĩ bạn có lẽ đang nói tới món ăn:{context}",
    },
    {
      role: "human",
      content: '{question},tên các món ăn phải được bọc trong dấu "",và giải thích sơ qua các món ăn này',
    },
  ]);

  const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
  });

  const outputParser = new StringOutputParser();

  const setupAndRetrieval = RunnableMap.from({
    context: new RunnableLambda({
      func: (input) =>
        retriever.invoke(input).then((responses) => {
          if (responses.length === 0) return "No relevant products found.";
          return responses
            .map(
              (response) =>
                `Product Name: "${response.metadata.name || "Unknown"}"
Price: ${response.metadata.price}
`
            )
            .join("\n\n");
        }),
    }).withConfig({ runName: "contextRetriever" }),
    question: new RunnablePassthrough(),
  });

  const chain = setupAndRetrieval.pipe(prompt).pipe(model).pipe(outputParser);

  return chain;
}

async function handleSearch(query) {
  try {
    const chain = await setupLangChain();
    const response = await chain.invoke(query);

    const productNames = response.match(/"\s*([^"]+)\s*"/g)
      ?.map(match => match.replace(/"/g, "").trim());

    if (productNames && productNames.length > 0) {
      const productNamesWithoutQuotes = productNames
        .map((name) => name.replace(/"/g, '').trim())
        .filter(name => name.length > 0);

      if (productNamesWithoutQuotes.length > 0) {
        const products = await db.Product.findAll({
          where: {
            name: {
              [Op.or]: productNamesWithoutQuotes.map(name => ({
                [Op.like]: `%${name}%`
              }))
            }
          },
        });

        if (products.length > 0) {
          return {
            product: products,
            description: response,
          };
        } else {
          return {
            product: null,
            description: response,
          };
        }
      } else {
        return {
          product: null,
          description: "No valid product names found.",
        };
      }
    } else {
      return {
        product: null,
        description: "No product names in quotes found.",
      };
    }
  } catch (error) {
    console.error("Error during search:", error.message);
    throw new Error("Chatbot search failed.");
  }
}

module.exports = { handleSearch };
const { SuccessResponse } = require('../../core/success.response');
const IntelligentSearch = require('../../services/LLM/langChain');
class langchainController {
  LmmSearch = async (req, res) => {
    new SuccessResponse({
      message: 'success llm',
      metadata: await IntelligentSearch.handleSearch(req.body.query),
    }).send(res);
  };
}
module.exports = new langchainController();

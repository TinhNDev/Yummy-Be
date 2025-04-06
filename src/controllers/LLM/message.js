const { SuccessResponse } = require('../../core/success.response');
const MessageService = require('../../services/LLM/message');

class MessageController {
  saveHistoryMessage = async (req, res, next) => {
    new SuccessResponse({
      message: 'OK',
      metadata: await MessageService.saveHistoryMessage({
        user_id: req.user.user_id,
        message: req.body.message,
      }),
    }).send(res);
  };
  getHistoryMessage = async (req, res) => {
    new SuccessResponse({
      message: 'OK',
      metadata: await MessageService.getChatHistory(req.user.user_id),
    }).send(res);
  };
}

module.exports = new MessageController();

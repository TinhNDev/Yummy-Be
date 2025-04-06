const express = require('express');
const { asyncHandle } = require('../../helper/asyncHandler');
const langChainController = require('../../controllers/LLM/langChain.controller');
const MessageController = require('../../controllers/LLM/message');
const { authorization, checkRole } = require('../../auth/authUtils');
const router = express.Router();

router.post('/llm', authorization, asyncHandle(langChainController.LmmSearch));
router.post(
  '/message',
  authorization,
  asyncHandle(MessageController.saveHistoryMessage)
);
router.get(
  '/message',
  authorization,
  asyncHandle(MessageController.getHistoryMessage)
);
module.exports = router;

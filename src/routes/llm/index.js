const express = require('express');
const { asyncHandle } = require('../../helper/asyncHandler');
const langChainController = require('../../controllers/LLM/langChain.controller');
const router = express.Router();

router.post("/llm",asyncHandle(langChainController.LmmSearch));
module.exports = router
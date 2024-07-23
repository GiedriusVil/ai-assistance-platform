/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const transcriptsRouter = express.Router();

const { transcriptsController } = require('../../controllers');

transcriptsRouter.get('/:conversationId', transcriptsController.findOneByConversationId);
transcriptsRouter.put('/mask-user-message', transcriptsController.maskUserMessage);

module.exports = {
    transcriptsRouter,
}

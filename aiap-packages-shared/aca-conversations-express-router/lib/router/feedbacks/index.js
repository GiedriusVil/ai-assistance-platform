/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const feedbacksRouter = express.Router();

const { feedbacksController } = require('../../controllers');

feedbacksRouter.get('/', feedbacksController.findManyByQuery);
feedbacksRouter.get('/:id', feedbacksController.findOneById);

feedbacksRouter.post('/', feedbacksController.saveOne);

module.exports = {
    feedbacksRouter,
}

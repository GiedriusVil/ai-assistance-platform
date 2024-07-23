/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { appendAcaContextToRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const express = require('express');
const conversationsRouter = express.Router();

const { conversationsController } = require('../../controllers');

conversationsRouter.post(
  '/',
  conversationsController.findManyByQuery,
  appendAcaContextToRequest,
);

conversationsRouter.delete(
  '/:conversationId',
  conversationsController.deleteOneByConversationId
);

conversationsRouter.post(
  '/addReview',
  conversationsController.addReview
);

conversationsRouter.post(
  '/removeReview',
  conversationsController.removeReview
);

conversationsRouter.post(
  '/saveTags',
  conversationsController.saveTags
);

conversationsRouter.post(
  '/removeTags',
  conversationsController.removeTags
);

conversationsRouter.post(
  '/findOne',
  conversationsController.findOneById,
  appendAcaContextToRequest,
);

conversationsRouter.post(
  '/delete-many-by-ids',
  conversationsController.deleteManyByIds,
);

conversationsRouter.post(
  '/channels',
  conversationsController.channels,
);

module.exports = {
  conversationsRouter,
}

/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const {
  allowIfHasActionsPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const { rulesMessagesController } = require('../controller');

const rulesMessagesRoutes = express.Router();

rulesMessagesRoutes.post(
  '/save-one',
  allowIfHasActionsPermissions('messages.view.add'),
  rulesMessagesController.saveOne
);
rulesMessagesRoutes.post(
  '/find-many-by-query',
  rulesMessagesController.findManyByQuery
);
rulesMessagesRoutes.post(
  '/find-one-by-id',
  rulesMessagesController.findOneById
);
rulesMessagesRoutes.post(
  '/delete-one-by-id',
  allowIfHasActionsPermissions('messages.view.delete'),
  rulesMessagesController.deleteOneById
);
rulesMessagesRoutes.post(
  '/delete-many-by-ids',
  allowIfHasActionsPermissions('messages.view.delete'),
  rulesMessagesController.deleteManyByIds
);
rulesMessagesRoutes.post(
  '/export',
  rulesMessagesController.exportMessages
);
rulesMessagesRoutes.post(
  '/pull',
  allowIfHasActionsPermissions('messages.view.pull'),
  rulesMessagesController.pull
);

module.exports = {
  rulesMessagesRoutes,
};

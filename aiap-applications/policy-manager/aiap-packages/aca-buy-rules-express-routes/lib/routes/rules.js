/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const { formidableMiddlewareWrapper } = require('@ibm-aiap/aiap-express-midleware-provider');

const {
  allowIfHasActionsPermissions,
  allowIfHasPagesPermissions,
  allowIfHasAnyActionsPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const { rulesController } = require('../controller');

const rulesRoutes = express.Router();

rulesRoutes.post(
  '/find-one-by-id',
  allowIfHasPagesPermissions('BuyRulesView'),
  rulesController.findOneById,
);
rulesRoutes.post(
  '/find-many-by-query',
  //allowIfHasPagesPermissions('BuyRulesView'),
  rulesController.findManyByQuery,
);
rulesRoutes.post(
  '/save-one',
  allowIfHasAnyActionsPermissions('buy-rules.view.add', 'buy-rules.view.edit'),
  rulesController.saveOne,
);
rulesRoutes.post(
  '/delete-many-by-ids',
  allowIfHasActionsPermissions('buy-rules.view.remove'),
  rulesController.deleteManyByIds,
);
rulesRoutes.post(
  '/import-many',
  allowIfHasActionsPermissions('buy-rules.view.import'),
  formidableMiddlewareWrapper(),
  rulesController.importMany,
);
rulesRoutes.post(
  '/export-many',
  allowIfHasActionsPermissions('buy-rules.view.export'),
  rulesController.exportMany,
);

module.exports = {
  rulesRoutes,
};

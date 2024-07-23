/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const {
  allowIfHasActionsPermissions,
  allowIfHasPagesPermissions,
  allowIfHasAnyActionsPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const { rulesSuppliersController } = require('../controller');

const rulesSuppliersRoutes = express.Router();

rulesSuppliersRoutes.post(
  '/find-one-by-id',
  allowIfHasPagesPermissions('BuyRulesView'),
  rulesSuppliersController.findOneById,
);
rulesSuppliersRoutes.post(
  '/find-many-by-query',
  allowIfHasPagesPermissions('BuyRulesView'),
  rulesSuppliersController.findManyByQuery,
);
rulesSuppliersRoutes.post(
  '/save-one',
  allowIfHasAnyActionsPermissions('buy-rules.view.edit.suppliers.add', 'buy-rules.view.edit.suppliers.edit'),
  rulesSuppliersController.saveOne,
);
rulesSuppliersRoutes.post(
  '/delete-many-by-ids',
  allowIfHasActionsPermissions('buy-rules.view.edit.suppliers.remove'),
  rulesSuppliersController.deleteManyByIds,
);

module.exports = {
  rulesSuppliersRoutes,
};

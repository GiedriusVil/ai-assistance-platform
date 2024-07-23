/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const {
  allowIfHasActionsPermissions,
  allowIfHasPagesPermissions,
  allowIfHasAnyActionsPermissions
} = require('@ibm-aiap/aiap-user-session-provider');

const { rulesConditionsController } = require('../controller');

const rulesConditionsRoutes = express.Router();

rulesConditionsRoutes.post(
  '/find-one-by-id',
  allowIfHasPagesPermissions('BuyRulesView'),
  rulesConditionsController.findOneById,
);
rulesConditionsRoutes.post(
  '/find-many-by-query',
  allowIfHasPagesPermissions('BuyRulesView'),
  rulesConditionsController.findManyByQuery,
);
rulesConditionsRoutes.post(
  '/save-one',
  allowIfHasAnyActionsPermissions('buy-rules.view.edit.conditions.add', 'buy-rules.view.edit.conditions.edit'),
  rulesConditionsController.saveOne,
);
rulesConditionsRoutes.post(
  '/delete-many-by-ids',
  allowIfHasActionsPermissions('buy-rules.view.edit.conditions.remove'),
  rulesConditionsController.deleteManyByIds,
);

module.exports = {
  rulesConditionsRoutes,
};

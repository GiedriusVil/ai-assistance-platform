/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const {
  allowIfHasPagesPermissions,
  allowIfHasAnyActionsPermissions,
  allowIfHasActionsPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const { rulesConditionsController } = require('../controller');

const rulesConditionsRoutes = express.Router();

rulesConditionsRoutes.post(
  '/find-one-by-id',
  allowIfHasPagesPermissions('CatalogRulesView'),
  rulesConditionsController.findOneById
);
rulesConditionsRoutes.post(
  '/find-many-by-query',
  allowIfHasPagesPermissions('CatalogRulesView'),
  rulesConditionsController.findManyByQuery
);
rulesConditionsRoutes.post(
  '/save-one', allowIfHasAnyActionsPermissions('catalog-rules.view.edit.conditions.add', 'catalog-rules.view.edit.conditions.edit'),
  rulesConditionsController.saveOne
);
rulesConditionsRoutes.post(
  '/delete-many-by-ids', allowIfHasActionsPermissions('catalog-rules.view.edit.conditions.remove'),
  rulesConditionsController.deleteManyByIds
);

module.exports = {
  rulesConditionsRoutes,
};

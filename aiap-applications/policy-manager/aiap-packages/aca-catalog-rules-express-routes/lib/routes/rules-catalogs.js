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

const { rulesCatalogsController } = require('../controller');

const rulesCatalogsRoutes = express.Router();

rulesCatalogsRoutes.post(
  '/find-one-by-id',
  allowIfHasPagesPermissions('CatalogRulesView'),
  rulesCatalogsController.findOneById
);
rulesCatalogsRoutes.post(
  '/find-many-by-query',
  allowIfHasPagesPermissions('CatalogRulesView'),
  rulesCatalogsController.findManyByQuery
);
rulesCatalogsRoutes.post(
  '/save-one',
  allowIfHasAnyActionsPermissions('catalog-rules.view.edit.catalogs.add', 'catalog-rules.view.edit.catalogs.edit'),
  rulesCatalogsController.saveOne
);
rulesCatalogsRoutes.post(
  '/delete-many-by-ids',
  allowIfHasActionsPermissions('catalog-rules.view.edit.catalogs.remove'),
  rulesCatalogsController.deleteManyByIds
);

module.exports = {
  rulesCatalogsRoutes,
};

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

const { ruleActionsController } = require('../controllers');

const multer = require('multer');

const importer = multer({
  storage: multer.diskStorage({})
});

const ruleActionsRoutes = express.Router();

ruleActionsRoutes.post(
  '/find-one-by-id',
  allowIfHasPagesPermissions('RuleActionsViewV1'),
  ruleActionsController.findOneById
);
ruleActionsRoutes.post(
  '/find-many-by-query',
  allowIfHasPagesPermissions('RuleActionsViewV1'),
  ruleActionsController.findManyByQuery
);
ruleActionsRoutes.post(
  '/save-one',
  allowIfHasAnyActionsPermissions(
    'rule-actions.view.add',
    'rule-actions.view.edit'
  ),
  ruleActionsController.saveOne
);
ruleActionsRoutes.post(
  '/delete-many-by-ids',
  allowIfHasActionsPermissions('rule-actions.view.remove'),
  ruleActionsController.deleteManyByIds
);
ruleActionsRoutes.post(
  '/import-many',
  allowIfHasActionsPermissions('rule-actions.view.import'),
  importer.single('ruleActionsFile'),
  ruleActionsController.importMany
);
ruleActionsRoutes.post(
  '/export-many',
  allowIfHasActionsPermissions('rule-actions.view.export'),
  ruleActionsController.exportMany
);

module.exports = {
  ruleActionsRoutes,
};

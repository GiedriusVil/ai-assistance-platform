/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const {
  allowIfHasActionsPermissions,
  allowIfHasAnyActionsPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const validationEngagementsRoutes = express.Router({ mergeParams: true });

const { validationEngagementsController } = require('../../controller');

validationEngagementsRoutes.post(
  '/save-one',
  allowIfHasAnyActionsPermissions(
    'validation-engagements.view.add',
    'validation-engagements.view.edit'
  ),
  validationEngagementsController.saveOne
);
validationEngagementsRoutes.post(
  '/find-many-by-query',
  validationEngagementsController.findManyByQuery
);
validationEngagementsRoutes.post(
  '/find-many-lite-by-query',
  validationEngagementsController.findManyLiteByQuery
);
validationEngagementsRoutes.post(
  '/find-one-by-id',
  validationEngagementsController.findOneById
);
validationEngagementsRoutes.post(
  '/find-one-by-rule-id',
  validationEngagementsController.findOneByRuleId
);
validationEngagementsRoutes.post(
  '/delete-many-by-keys',
  allowIfHasActionsPermissions('validation-engagements.view.remove'),
  validationEngagementsController.deleteManyByKeys
);
validationEngagementsRoutes.post(
  '/delete-many-by-ids',
  allowIfHasActionsPermissions('validation-engagements.view.remove'),
  validationEngagementsController.deleteManyByIds
);
validationEngagementsRoutes.post(
  '/get-paths-by-id',
  validationEngagementsController.getPathsById
);

module.exports = validationEngagementsRoutes;

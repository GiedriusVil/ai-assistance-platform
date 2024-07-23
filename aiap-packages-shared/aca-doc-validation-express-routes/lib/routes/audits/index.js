/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const {
  allowIfHasActionsPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const { auditsController } = require('../../controllers');

const auditsRoutes = express.Router({ mergeParams: true });

auditsRoutes.post(
  '/find-many-by-query',
  auditsController.findManyByQuery
);
auditsRoutes.post(
  '/find-one-by-id',
  auditsController.findOneById
);
auditsRoutes.post(
  '/export-many',
  allowIfHasActionsPermissions('transaction-audits.view.export'),
  auditsController.exportMany,
);
auditsRoutes.post(
  '/report',
  allowIfHasActionsPermissions('transaction-audits.view.export'),
  auditsController.generateReport,
);

module.exports = {
  auditsRoutes,
};

/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router({ mergeParams: true });

const {
  allowIfHasActionsPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const { validationEngagementsController } = require('../../controller');

routes.get(
  '/',
  allowIfHasActionsPermissions('validation-engagements.view.export'),
  validationEngagementsController.exportMany
);

module.exports = routes;

/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const {
  allowIfHasPagesPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const { rulesExternalCatalogsController } = require('../controller');

const rulesExternalCatalogsRoutes = express.Router();

rulesExternalCatalogsRoutes.post(
  '/find-many-by-query',
  allowIfHasPagesPermissions('CatalogRulesView'),
  rulesExternalCatalogsController.findManyByQuery
);

module.exports = {
  rulesExternalCatalogsRoutes,
};

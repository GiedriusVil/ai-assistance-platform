/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const {
  allowIfHasActionsPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const routes = express.Router({ mergeParams: true });
const multer = require('multer');
const importer = multer({
  storage: multer.diskStorage({})
});

const { rulesController } = require('../../controller');

routes.post(
  '/',
  allowIfHasActionsPermissions('rules-v2.view.import'),
  importer.single('rulesV2File'),
  rulesController.importManyFromFile
);

module.exports = routes;

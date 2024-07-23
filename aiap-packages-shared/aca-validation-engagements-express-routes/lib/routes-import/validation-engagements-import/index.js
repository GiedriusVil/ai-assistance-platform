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

const { validationEngagementsController } = require('../../controller');

routes.post(
  '/',
  allowIfHasActionsPermissions('validation-engagements.view.import'),
  importer.single('validationEngagementsFile'),
  validationEngagementsController.importManyFromFile
);

module.exports = routes;

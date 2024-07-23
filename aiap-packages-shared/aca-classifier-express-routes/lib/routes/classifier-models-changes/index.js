/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const classifierModelsChangesRoutes = express.Router();

const { classifierModelsChangesController } = require('../../controllers');

classifierModelsChangesRoutes.post('/find-many-by-query', classifierModelsChangesController.findManyByQuery);
classifierModelsChangesRoutes.post('/find-one-by-id', classifierModelsChangesController.findOneById);

module.exports = {
  classifierModelsChangesRoutes,
};

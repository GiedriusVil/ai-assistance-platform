/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const classifierModelsRoutes = express.Router({ mergeParams: true });

const { classifierModelsController } = require('../../controllers');

classifierModelsRoutes.post('/delete-many-by-ids', classifierModelsController.deleteManyByIds);
classifierModelsRoutes.post('/find-many-by-query', classifierModelsController.findManyByQuery);
classifierModelsRoutes.post('/find-one-by-id', classifierModelsController.findOneById);
classifierModelsRoutes.post('/save-one', classifierModelsController.saveOne);
classifierModelsRoutes.post('/test-one-by-id', classifierModelsController.testOneById);
classifierModelsRoutes.post('/train-one-by-id', classifierModelsController.trainOneById);

module.exports = {
   classifierModelsRoutes,
};

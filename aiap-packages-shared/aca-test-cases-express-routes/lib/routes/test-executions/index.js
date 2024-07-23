/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const testExecutionsRoutes = express.Router();

const { testExecutionsController } = require('../../controllers');

testExecutionsRoutes.post('/save-one', testExecutionsController.saveOne);
testExecutionsRoutes.post('/save-many', testExecutionsController.saveMany);
testExecutionsRoutes.post('/generate-many', testExecutionsController.generateMany);
testExecutionsRoutes.post('/find-many-by-query', testExecutionsController.findManyByQuery);
testExecutionsRoutes.post('/find-one-by-id', testExecutionsController.findOneById);
testExecutionsRoutes.post('/delete-many-by-ids', testExecutionsController.deleteManyByIds);

module.exports = {
   testExecutionsRoutes,
};

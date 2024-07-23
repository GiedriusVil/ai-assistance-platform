/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const testWorkersRoutes = express.Router();

const { testWorkersController } = require('../../controllers');

testWorkersRoutes.post('/save-one', testWorkersController.saveOne);
testWorkersRoutes.post('/find-many-by-query', testWorkersController.findManyByQuery);
testWorkersRoutes.post('/find-many-lite-by-query', testWorkersController.findManyLiteByQuery);
testWorkersRoutes.post('/find-one-by-id', testWorkersController.findOneById);
testWorkersRoutes.post('/delete-many-by-ids', testWorkersController.deleteManyByIds);

module.exports = {
   testWorkersRoutes,
};

/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const testCasesRoutes = express.Router();

const { testCasesController } = require('../../controllers');

testCasesRoutes.post('/save-one', testCasesController.saveOne);
testCasesRoutes.post('/find-many-by-query', testCasesController.findManyByQuery);
testCasesRoutes.post('/find-one-by-id', testCasesController.findOneById);
testCasesRoutes.post('/delete-many-by-ids', testCasesController.deleteManyByIds);

module.exports = {
   testCasesRoutes,
};

/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const configurationsRoutes = express.Router({ mergeParams: true });

const { configurationsController } = require('../../controller');

configurationsRoutes.post('/save-one', configurationsController.saveOne);
configurationsRoutes.post('/find-many-by-query', configurationsController.findManyByQuery);
configurationsRoutes.post('/find-one-by-key', configurationsController.findOneByKey);
configurationsRoutes.post('/delete-many-by-keys', configurationsController.deleteManyByKeys);

module.exports = configurationsRoutes;

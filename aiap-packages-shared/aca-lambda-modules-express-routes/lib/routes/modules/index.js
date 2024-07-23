/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const modulesRoutes = express.Router({ mergeParams: true });

const { modulesController } = require('../../controller');

modulesRoutes.post('/save-one', modulesController.saveOne);
modulesRoutes.post('/compile-one', modulesController.compileOne);
modulesRoutes.post('/find-many-by-query', modulesController.findManyByQuery);
modulesRoutes.post('/find-one-by-id', modulesController.findOneById);
modulesRoutes.post('/delete-one-by-id', modulesController.deleteOneById);
modulesRoutes.post('/delete-many-by-ids', modulesController.deleteManyByIds);
modulesRoutes.post('/pull', modulesController.pull);
modulesRoutes.post('/refresh', modulesController.refresh);

module.exports = modulesRoutes;

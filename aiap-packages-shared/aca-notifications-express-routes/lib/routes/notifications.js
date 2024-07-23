/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const notificationsRoutes = express.Router();

const { notificationsController } = require('../controller');

notificationsRoutes.post('/find-many-by-query', notificationsController.findManyByQuery);
notificationsRoutes.post('/find-one-by-id', notificationsController.findOneById);
notificationsRoutes.post('/save-one', notificationsController.saveOne);
notificationsRoutes.post('/delete-one-by-id', notificationsController.deleteOneById);

module.exports = {
    notificationsRoutes,
}






/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const redisClientsRoutes = express.Router({ mergeParams: true });

const { redisClientsController } = require('../../controllers');

redisClientsRoutes.get('/', redisClientsController.retrieveMany);

module.exports = {
   redisClientsRoutes,
};

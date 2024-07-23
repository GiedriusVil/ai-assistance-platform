/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const eventStreamsRoutes = express.Router();

const { eventStreamsController } = require('../../controllers');

eventStreamsRoutes.get('/', eventStreamsController.retrieveMany);

module.exports = {
    eventStreamsRoutes,
};

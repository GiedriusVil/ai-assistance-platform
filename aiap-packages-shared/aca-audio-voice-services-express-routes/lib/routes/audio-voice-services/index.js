/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const audioVoiceServicesRouter = express.Router();

const { audioVoiceServicesController } = require('../../controller');

audioVoiceServicesRouter.post('/save-one', audioVoiceServicesController.saveOne);
audioVoiceServicesRouter.post('/find-many-by-query', audioVoiceServicesController.findManyByQuery);
audioVoiceServicesRouter.post('/find-one-by-id', audioVoiceServicesController.findOneById);
audioVoiceServicesRouter.post('/delete-many-by-ids', audioVoiceServicesController.deleteManyByIds);


module.exports = audioVoiceServicesRouter

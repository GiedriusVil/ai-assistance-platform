/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const surveysRouter = express.Router();

const { surveysController } = require('../../controllers');

surveysRouter.post('/average-score', surveysController.findAvgScoreByQuery);
surveysRouter.post('/', surveysController.findManyByQuery);

module.exports = {
  surveysRouter,
}

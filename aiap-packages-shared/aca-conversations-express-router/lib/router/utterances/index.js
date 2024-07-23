/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const utterancesRouter = express.Router();

const { utterancesController } = require('../../controllers');

utterancesRouter.post('/', utterancesController.findManyByQuery);
utterancesRouter.post('/top-intents', utterancesController.findTopIntentsByQuery);
utterancesRouter.post('/totals', utterancesController.retrieveTotals);
utterancesRouter.post('/:id', utterancesController.updateOneById);

module.exports = {
    utterancesRouter,
}

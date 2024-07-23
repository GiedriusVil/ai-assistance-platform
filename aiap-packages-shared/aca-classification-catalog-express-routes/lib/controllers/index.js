/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const catalogsController = require('./catalogs');
const segmentsController = require('./segments');
const familiesController = require('./families');
const classesController = require('./classes');
const subClassesController = require('./sub-classes');
const vectorsController = require('./vectors');

module.exports = {
    catalogsController,
    segmentsController, 
    familiesController,
    classesController,
    subClassesController,
    vectorsController,
};

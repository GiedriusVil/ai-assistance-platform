/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const actionsService = require('./actions');
const catalogsService = require('./catalogs');
const classesService = require('./classes');
const familiesService = require('./families');
const segmentsService = require('./segments');
const subClassesService = require('./sub-classes');
const verctorsService = require('./vectors');
const runtimeDataService = require('./runtime-data');

module.exports = {
  actionsService,
  catalogsService,
  classesService,
  familiesService,
  segmentsService,
  subClassesService,
  verctorsService,
  runtimeDataService,
}

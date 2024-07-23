/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { findManyClassesByQuery } = require('./classes');
const { findManyCommoditiesByQuery } = require('./commodities');
const { findManyFamiliesByQuery } = require('./families');
const { findManySegmentsByQuery } = require('./segments');

module.exports = {
  findManyClassesByQuery,
  findManyCommoditiesByQuery,
  findManyFamiliesByQuery,
  findManySegmentsByQuery,
}

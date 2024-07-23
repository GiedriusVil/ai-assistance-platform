/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { findManyByQuery } = require('./find-many-by-query');
const { findOneById } = require('./find-one-by-id');

module.exports = {
  findOneById,
  findManyByQuery,
};

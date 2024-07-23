/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { FulfillWare } = require('./fulfill-ware');
const { isPendingActions } = require('./actions');

module.exports = {
  FulfillWare,
  isPendingActions,
};

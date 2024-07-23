/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { Enrich } = require('./Enrich');
const { EnrichIncomingWare } = require('./EnrichIncomingWare');

module.exports = {
  EnrichIncomingWare,
  Incoming: EnrichIncomingWare,
  Enrich,
};

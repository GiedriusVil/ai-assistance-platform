/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const botStates = {
  NEW: 'NEW',
  UPDATE: 'UPDATE',
  MONITOR: 'MONITOR',
  INTERNAL_UPDATE: 'INTERNAL_UPDATE',
  ALL: 'ALL',
};

const middlewareTypes = {
  INCOMING: 'incoming',
  OUTGOING: 'outgoing',
};

export {
  botStates,
  middlewareTypes,
}

/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-common-botmaster-actions-vf-apis`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

// Use large timeout to allow the gateway to complete the opperations
// const TIMEOUT = 30000;

// const callGatewaySvc = (gatewayOptions, update, journeyId, uri, method, body) => {
//   const options = {
//     method,
//     uri,
//     body,
//     json: true,
//     jar: true,
//     timeout: TIMEOUT,
//     headers: {
//       ...(journeyId ? { 'x-aca-journey-id': journeyId } : {}),
//     },
//     context: {
//       ...{ traceId: update.getTraceId() },
//       ...{ test: update.session.test || {} },
//     },
//   };

//   if (logger.isDebug()) logger.debug('[ACTIONS][SEND-EMAIL] Calling Gateway API', { update, journeyId, uri });
//   return null;
// };



// const callSvc = (gatewayOptions, update, journeyId, msisdn, action, successToken, actionType, optional) => {
//   callGatewaySvc(gatewayOptions, update, journeyId, `${gatewayOptions.url}/api/v1/${actionType}/${action}`, 'POST', {
//     msisdn: msisdn,
//     data: optional,
//   }).then(res => (res && !ramda.isEmpty(res) ? res : successToken));
// }

const sendEmailApiCall = (gatewayOptions, update, data) => {
  logger.info(sendEmailApiCall.name, { gatewayOptions, data });
  // callSvc(gatewayOptions, update, 'sendEmail', undefined, 'check', 'checked', 'sendEmail', data);
}

module.exports = {
  sendEmailApiCall,
};

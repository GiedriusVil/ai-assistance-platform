/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-demo-actions-blinds`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);


const Blinds = (configuration) => ({
  replace: 'all',
  series: true,
  evaluate: 'step',
  controller: async (params) => {
    logger.info(Blinds.name, { configuration });
    // const { lifting, angle } = attributes;

    // const body = {
    //   ...configuration.iot.blinds,
    //   lifting: lifting ? Number(lifting) : undefined,
    //   angle: lifting ? Number(angle) : undefined,
    //   ...attributes,
    // };

    // const opts = {
    //   method: 'POST',
    //   uri: configuration.gatewayClient.url + '/api/v1/iot/blinds',
    //   json: true,
    //   timeout: 5000,
    //   body: body,
    // };
  },
});

module.exports = {
  Blinds,
};

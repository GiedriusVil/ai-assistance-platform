/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-demo-actions-socket`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

// const isValidInput = (toggle, dim) => {
//   return !(toggle && dim);
// };

// const toggleValue = (toggle, dim) => {
//   if (toggle) return toggle == 'on' ? 255 : 0;
//   if (dim) return Number(dim);
// };

const Socket = (configuration) => ({
  replace: 'all',
  series: true,
  evaluate: 'step',
  controller: async (params) => {
    logger.info(Socket.name, { configuration });
    // const { toggle, dim } = attributes;

    // if (!isValidInput(toggle, dim)) return;

    // const body = {
    //   ...config.iot.socket,
    //   value: toggleValue(toggle, dim),
    //   ...attributes,
    // };

    // const opts = {
    //   method: 'POST',
    //   uri: config.gatewayClient.url + '/api/v1/iot/socket',
    //   json: true,
    //   timeout: 5000,
    //   body: body,
    // };

  },
});

module.exports = {
  Socket,
};

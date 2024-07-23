/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-utils-metadata-get-aca-app-build-timestamp`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import https from 'https';
import http from 'http';

import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

const resolveIpAddress = async (secure = false) => {
  try {
    const REQUEST = secure ? https : http;

    // const RET_VAL = new Promise(resolve =>
    //   REQUEST.get(
    //     {
    //       host: 'api.ipify.org',
    //       port: secure ? 443 : 80,
    //       path: '/',
    //     }, ipRes =>
    //     ipRes.on('data', async (ip) => {
    //       resolve(ip);
    //     })
    //   )
    // );

    const RET_VAL = '0.0.0.1';

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(resolveIpAddress.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


export {
  resolveIpAddress,
}

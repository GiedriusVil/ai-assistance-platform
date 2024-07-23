/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-brain-brain-status-brain-status-handler';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  resolveIpAddress,
} from '@ibm-aca/aca-utils-metadata';

import {
  BrainStatus,
} from './brain-status';

const BrainStatusHandler = (
  params: {
    brainStatusFn: any,
    namespace: any,
    version: any,
    secure?: boolean,
  },
) => {
  const isOffline = response => response.status == BrainStatus.status.OFFLINE;
  let tmpSecure = false;
  if (
    params?.secure
  ) {
    tmpSecure = params?.secure;
  }

  const HANDLER = async (
    request: any,
    response: any,
  ) => {
    try {

      const ip = await resolveIpAddress(tmpSecure);

      const RESPONSE: any = {
        namespace: params?.namespace,
        version: params?.version,
        ip: ip ? ip.toString() : 'N/A',
      };
      const withDeps = request.query.deps;

      if (
        withDeps
      ) {
        const brainStatus = await params.brainStatusFn();
        RESPONSE.status = brainStatus.status;
        RESPONSE.dependencies = brainStatus.dependencies;
      } else {
        RESPONSE.status = BrainStatus.status.ONLINE;
      }

      if (
        isOffline(RESPONSE)
      ) {
        response.status(502).json(RESPONSE);
      } else {
        response.status(200).json(RESPONSE);
      }

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(BrainStatusHandler.name, { ACA_ERROR });
      response.status(500).json(
        {
          errors: [ACA_ERROR]
        }
      );
    }
  };

  return HANDLER;
}


export {
  BrainStatusHandler,
}

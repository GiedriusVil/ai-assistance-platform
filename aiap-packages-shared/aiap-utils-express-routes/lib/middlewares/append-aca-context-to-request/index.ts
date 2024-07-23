/*
  © Copyright IBM Corporation 2022. All Rights Reserved.

  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-utils-express-routes-middlewares-append-aca-context-to-request`;
const logger = require(`@ibm-aca/aca-common-logger`)(MODULE_ID);

import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

import {
  constructActionContextFromRequest,
} from '../../constructors';

export const appendAcaContextToRequest = (
  request: any,
  response: any,
  next: any,
) => {
  let acaContext;
  try {
    acaContext = constructActionContextFromRequest(request);
    request.acaContext = acaContext;
    next();
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(appendAcaContextToRequest.name, { errors: [ACA_ERROR] });
    response.status(500).json({ errors: [ACA_ERROR] })
  }

}


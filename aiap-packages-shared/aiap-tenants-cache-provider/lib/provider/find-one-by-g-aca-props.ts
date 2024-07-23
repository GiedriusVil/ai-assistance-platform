/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'tenants-store-tenants-find-one-by-g-aca-props';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  findOneByIdAndHash,
} from './find-one-by-id-and-hash';

export const findOneByGAcaProps = async (
  params: {
    gAcaProps: {
      tenantId: any,
      tenantHash: any,
    },
  },
) => {
  try {
    const G_ACA_PROPS = params?.gAcaProps;
    if (
      lodash.isEmpty(G_ACA_PROPS)
    ) {
      const MESSAGE = 'Missing required params.gAcaProps parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const G_ACA_PROPS_TENANT_ID = G_ACA_PROPS?.tenantId;
    const G_ACA_PROPS_TENANT_HASH = G_ACA_PROPS?.tenantHash;
    const PARAMS = {
      id: G_ACA_PROPS_TENANT_ID,
      hash: G_ACA_PROPS_TENANT_HASH,
    };
    const RET_VAL = await findOneByIdAndHash(PARAMS);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findOneByGAcaProps.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

/*
    © Copyright IBM Corporation 2022. All Rights Reserved 
     
    SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-engagements-datasource-mongo-collections-utils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import {
  IDatasourceConfigurationEngagementsV1
} from '../types/configuration';

const DEFAULT_COLLECTIONS = {
  engagements: 'engagements',
  engagementsChanges: 'engagementsChanges'
};

export const sanitizedCollectionsFromConfiguration = (
  configuration: IDatasourceConfigurationEngagementsV1
) => {
  const COLLECTIONS_CONFIGURATION = configuration?.collections;

  const ENGAGEMENTS = COLLECTIONS_CONFIGURATION?.engagements;
  const ENGAGEMENTS_CHANGES = COLLECTIONS_CONFIGURATION?.engagementsChanges;

  const RET_VAL = lodash.cloneDeep(DEFAULT_COLLECTIONS);
  if (
    !lodash.isEmpty(ENGAGEMENTS)
  ) {
    RET_VAL.engagements = ENGAGEMENTS;
  }
  if (
    !lodash.isEmpty(ENGAGEMENTS_CHANGES)
  ) {
    RET_VAL.engagementsChanges = ENGAGEMENTS_CHANGES;
  }
  return RET_VAL;
}

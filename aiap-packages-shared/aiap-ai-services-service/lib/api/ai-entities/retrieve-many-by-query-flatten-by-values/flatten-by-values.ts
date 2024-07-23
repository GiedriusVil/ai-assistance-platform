/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-services-service-service-ai-entities-retrieve-many-by-query-flatten-by-values';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  splitDate,
  splitTime,
} from '@ibm-aiap/aiap-utils-date';

import {
  AI_SERVICE_TYPE_ENUM,
  IAiEntityExternalV1WaV1,
  IAiEntityV1,
} from '@ibm-aiap/aiap--types-server';

const _flattenSynonyms = (
  value: {
    synonyms?: Array<any>
  },
) => {
  const RET_VAL = [];
  const SYNONYMS = value?.synonyms;
  if (
    !lodash.isEmpty(SYNONYMS) &&
    lodash.isArray(SYNONYMS)
  ) {
    for (const SYNONYM of SYNONYMS) {
      RET_VAL.push(SYNONYM?.synonym);
    }
  }
  return RET_VAL;
}

const appendFlattenEntitiesByValuesToTargetForWaV1 = (
  target: Array<IAiEntityV1>,
  entity: IAiEntityV1,
) => {
  let external: IAiEntityExternalV1WaV1;
  try {
    external = entity?.external as IAiEntityExternalV1WaV1;
    const VALUES = external?.values || [];
    if (
      !lodash.isEmpty(VALUES) &&
      lodash.isArray(VALUES)
    ) {
      for (const VALUE of VALUES) {
        const FLAT_SYNONYMS = _flattenSynonyms(VALUE);
        const SYNONYMS_PRETTYFIED = FLAT_SYNONYMS.join(', ');
        target.push(
          {
            type: AI_SERVICE_TYPE_ENUM.WA_V1,
            external: {
              entity: external?.entity,
              value: VALUE?.value,
              type: VALUE.type,
              synonyms: SYNONYMS_PRETTYFIED,
              patterns: VALUE.patterns,
              createdDate: splitDate(external?.created),
              createdTime: splitTime(external?.created),
              updatedDate: splitDate(external?.updated),
              updatedTime: splitTime(external?.updated),
            },
          },
        );

      }
    } else {
      target.push(entity);
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(appendFlattenEntitiesByValuesToTargetForWaV1.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export const flattenByValues = (
  entities: Array<IAiEntityV1>,
): Array<IAiEntityV1> => {
  const RET_VAL: Array<IAiEntityV1> = [];
  try {
    if (
      !lodash.isEmpty(entities) &&
      lodash.isArray(entities)
    ) {
      for (const ENTITY of entities) {
        const TYPE = ENTITY?.type;
        switch (TYPE) {
          case AI_SERVICE_TYPE_ENUM.WA_V1:
            appendFlattenEntitiesByValuesToTargetForWaV1(RET_VAL, ENTITY);
            break;
          default:
            break;
        }
      }
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(flattenByValues.name);
    throw ACA_ERROR;
  }
}

/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-ai-services-service-service-ai-dialog-nodes-retrieve-many-by-query-flatten-by-texts-flatten-by-texts';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  AI_SERVICE_TYPE_ENUM,
  IAiDialogNodeV1,
  IAiDialogNodeExternalWaV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  splitDate,
  splitTime,
} from '@ibm-aiap/aiap-utils-date';

const appendFlattenDialogNodesByTextsToTargetForWaV1 = (
  target: Array<IAiDialogNodeV1>,
  node: IAiDialogNodeV1,
) => {
  try {
    const NODE_EXTERNAL: IAiDialogNodeExternalWaV1 = node?.external;
    const TEXTS = ramda.pathOr([], [[0], 'values'], NODE_EXTERNAL?.output?.generic);
    if (
      !lodash.isEmpty(TEXTS) &&
      lodash.isArray(TEXTS)
    ) {
      for (const TEXT of TEXTS) {
        if (
          !lodash.isEmpty(TEXT)
        ) {
          target.push(
            {
              type: AI_SERVICE_TYPE_ENUM.WA_V1,
              external: {
                text: TEXT?.text,
                conditions: NODE_EXTERNAL?.conditions,
                title: NODE_EXTERNAL?.title,
                type: NODE_EXTERNAL?.type,
                parent: NODE_EXTERNAL?.parent,
                dialog_node: NODE_EXTERNAL?.dialog_node,
                createdDate: splitDate(NODE_EXTERNAL?.created),
                createdTime: splitTime(NODE_EXTERNAL?.created),
                updatedDate: splitDate(NODE_EXTERNAL?.updated),
                updatedTime: splitTime(NODE_EXTERNAL?.updated),
              }
            }
          );
        }
      }
    } else {
      target.push(
        {
          type: AI_SERVICE_TYPE_ENUM.WA_V1,
          external: {
            conditions: NODE_EXTERNAL?.conditions,
            title: NODE_EXTERNAL?.title,
            type: NODE_EXTERNAL.type,
            dialog_node: NODE_EXTERNAL?.dialog_node,
            parent: NODE_EXTERNAL?.parent,
            createdDate: splitDate(NODE_EXTERNAL.created),
            createdTime: splitTime(NODE_EXTERNAL.created),
            updatedDate: splitDate(NODE_EXTERNAL.updated),
            updatedTime: splitTime(NODE_EXTERNAL.updated),
          }
        }
      );
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(appendFlattenDialogNodesByTextsToTargetForWaV1.name);
    throw ACA_ERROR;
  }
}


export const flattenByTexts = (
  nodes: Array<IAiDialogNodeV1>,
): Array<IAiDialogNodeV1> => {
  const RET_VAL: Array<IAiDialogNodeV1> = [];
  try {

    if (
      !lodash.isEmpty(nodes)
    ) {
      for (const NODE of nodes) {
        const TYPE = NODE?.type;
        switch (TYPE) {
          case AI_SERVICE_TYPE_ENUM.WA_V1:
            appendFlattenDialogNodesByTextsToTargetForWaV1(RET_VAL, NODE);
            break;
          default:
            break;
        }
      }
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(flattenByTexts.name);
    throw ACA_ERROR;
  }
}

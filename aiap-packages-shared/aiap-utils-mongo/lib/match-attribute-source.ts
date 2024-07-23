/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  isValueTrue,
} from './is-value-true';

/**
 * @matcher filters user messages (includes or excludes system messages based on param value)
 * @param {*} params query params
 * @deprecated - Follosing method needs refactoring!
 */
const matchAttributeSource = (
  params: {
    options: {
      isSystemMessagesVisible: any,
    },
    filter: {
      isSystemMessagesVisible: any,
    }
  },
) => {
  const RET_VAL = {};

  if (
    (
      lodash.isString(params?.options?.isSystemMessagesVisible) &&
      lodash.isEmpty(params?.options?.isSystemMessagesVisible)
    ) ||
    lodash.isBoolean(params?.options?.isSystemMessagesVisible) ||
    (
      lodash.isString(params?.filter?.isSystemMessagesVisible) &&
      lodash.isEmpty(params?.filter?.isSystemMessagesVisible)
    ) ||
    lodash.isBoolean(params?.filter?.isSystemMessagesVisible)
  ) {
    const SHOW_SYSTEM_UTTERANCES =
      params?.options?.isSystemMessagesVisible ||
      params?.filter?.isSystemMessagesVisible ||
      false;

    if (
      isValueTrue(SHOW_SYSTEM_UTTERANCES)
    ) {
      RET_VAL['$or'] = [
        {
          'source': {
            $regex: 'user',
            $options: 'i'
          }
        },
        {
          'source': {
            $regex: 'system',
            $options: 'i'
          }
        },
      ];
    } else {
      RET_VAL['source'] = {
        $regex: 'user',
        $options: 'i',
      };
    }
  }
  return RET_VAL;
};

export {
  matchAttributeSource,
}

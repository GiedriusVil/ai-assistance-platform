/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  matchAttributeByRegex,
} from '@ibm-aiap/aiap-utils-mongo';

const matchByAnswerKey = (
  params: {
    moduleId: any,
  },
) => {
  const RET_VAL = {
    $match: {
      $and: [
        matchAttributeByRegex('external.dialog_nodes.output.generic.values.text', `<${params.moduleId} `)
      ]
    },
  };
  return RET_VAL;
}

const groupSkills = () => {
  const RET_VAL = {
    $group: {
      _id: null,
      skills: {
        $push: {
          name: '$name',
          id: '$_id',
          aiServiceId: '$aiServiceId',
        }
      }
    },
  };
  return RET_VAL;
}

export const aggregateQuery = (
  context: IContextV1,
  params: {
    moduleId: any,
  },
) => {
  const RET_VAL = [];
  RET_VAL.push(matchByAnswerKey(params));
  RET_VAL.push(groupSkills());
  return RET_VAL;
}

/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

const MODULE_ID = 'access-group-policy-utils';

function _cloneAndSanitizePolicyViewAction(action: any) {
  let retVal: any;
  const ACTION_NAME = action?.name;
  const ACTION_COMPONENT = action?.component;
  if (
    !lodash.isEmpty(ACTION_NAME) &&
    !lodash.isEmpty(ACTION_COMPONENT)
  ) {
    retVal = {
      name: ACTION_NAME,
      component: ACTION_COMPONENT,
    }
  }
  return retVal;
}

function _cloneAndSanitizePolicyViewActions(policy: any) {
  const RET_VAL = [];
  let actions;
  try {
    actions = policy?.view?.actions;
    if (
      !lodash.isEmpty(actions) &&
      lodash.isArray(actions)
    ) {
      for (let action of actions) {
        let sanitizedAction = _cloneAndSanitizePolicyViewAction(action);
        if (
          !lodash.isEmpty(sanitizedAction)
        ) {
          RET_VAL.push(sanitizedAction);
        }
      }
    }
    return RET_VAL;

  } catch (error) {
    _errorX(MODULE_ID, '_cloneAndSanitizePolicyViewActions', { error, policy });
    throw error;
  }
}

export function _cloneAndSanitizePolicyTenant(policy: any) {
  const RET_VAL = {
    id: policy?.tenant?.id,
    name: policy?.tenant?.name,
    environmentId: policy?.tenant?.environmentId,
  };
  return RET_VAL;
}

export function _cloneAndSanitizePolicyApplication(policy: any) {
  const RET_VAL = {
    id: policy?.application?.id,
    name: policy?.application?.name,
  };
  return RET_VAL;
}

export function _cloneAndSanitizePolicyAssistant(policy: any) {
  const RET_VAL = {
    id: policy?.assistant?.id,
    name: policy?.assistant?.name,
  };
  return RET_VAL;
}

export function _cloneAndSanitizePolicyView(policy: any) {
  const RET_VAL = {
    name: policy?.view?.name,
    component: policy?.view?.component,
    actions: _cloneAndSanitizePolicyViewActions(policy),
  };
  return RET_VAL;
}

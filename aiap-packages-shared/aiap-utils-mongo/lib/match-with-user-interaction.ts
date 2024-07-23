/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { isValueTrue } from './is-value-true';

const matchWithUserInteraction = (
  params: {
    interaction: any,
  }
) => {
  const INTERACTION = params?.interaction || false;

  const HAS_USER_INTERACTION = isValueTrue(INTERACTION);
  const RET_VAL: any = {};

  RET_VAL.hasUserInteraction = {
    $eq: HAS_USER_INTERACTION
  };

  return RET_VAL;
}

export {
  matchWithUserInteraction,
}

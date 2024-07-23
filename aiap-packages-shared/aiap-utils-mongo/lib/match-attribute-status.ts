/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

/**
 * 
 * @param params 
 * @returns 
 * @deprecated -> Use more generic matcher!
 */
const matchAttributeStatus = (
  params: {
    status: {
      enabled: any
    }
  }
) => {
  const RET_VAL = {};
  const STATUS = params?.status?.enabled;
  if (
    STATUS
  ) {
    RET_VAL['status.enabled'] = STATUS;
  }
  return RET_VAL;
};

export {
  matchAttributeStatus,
}

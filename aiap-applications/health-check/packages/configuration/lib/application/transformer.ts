/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const transformAppConfiguration = async (rawConfiguration) => {
  const RET_VAL = {
    port: rawConfiguration.PORT || 3011,
  };
  return RET_VAL;
}

export {
  transformAppConfiguration
}

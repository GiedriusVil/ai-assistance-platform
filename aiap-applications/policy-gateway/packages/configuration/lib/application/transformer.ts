/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const transformAppConfiguration = async (rawConfiguration) => {
  const RET_VAL = {
    users: {
      admin: {
        username: rawConfiguration.ADMIN_USER_NAME || 'admin',
        password: rawConfiguration.ADMIN_USER_PASS,
      }
    },
    port: rawConfiguration.PORT || 3007,
  };
  return RET_VAL;
}

export {
  transformAppConfiguration
}

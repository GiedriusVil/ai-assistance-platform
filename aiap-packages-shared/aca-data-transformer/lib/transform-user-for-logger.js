/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
// const MODULE_ID = `aca-data-transformer-transform-user-for-logger`;

const transformUserForLogger = (user) => {
  const RET_VAL = {};
  if (
    user &&
    user.id &&
    user.username
  ) {
    RET_VAL.userId = user?.id;
    RET_VAL.userName = user?.username;
    RET_VAL.lastSession = {
      timestamp: user?.lastSession?.timestamp,
      tenant: {
        id: user?.lastSession?.tenant?.id,
        hash: user?.lastSession?.tenant?.hash
      },
      application: {
        id: user?.lastSession?.application?.id,
      }
    }
  }
  return RET_VAL;
}

module.exports = {
  transformUserForLogger
}

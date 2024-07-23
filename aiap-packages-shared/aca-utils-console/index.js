/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const util = require('util')


const consoleX = {
  log: (message, object) => {
    console.log(message);
    console.log(util.inspect(
      object,
      {
        showHidden: false,
        depth: null,
        colors: true
      })
    )
  },
  error: (message, object) => {
    console.error(message);
    console.error(util.inspect(
      object,
      {
        showHidden: false,
        depth: null,
        colors: true
      })
    )
  }
}


module.exports = {
  consoleX,
}

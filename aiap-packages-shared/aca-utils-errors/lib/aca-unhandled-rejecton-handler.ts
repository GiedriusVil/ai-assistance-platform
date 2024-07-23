/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const acaUnhandledRejectionHandler = (reason, promise) => {
  console.log(`UNHANDLED_REJECTION_HANDLER time: ${Date.now()} pid: ${process.pid} reason: `, reason);
  console.log(`UNHANDLED_REJECTION_HANDLER time: ${Date.now()} pid: ${process.pid} promise: `, promise);
  if (
    'true' === process.env.ACA_ON_UNHANDLED_EXCEPTION_KILL_APPLICATION
  ) {
    process.kill(process.pid, 'SIGTERM');
  }
};

const addUnhandledRejectionHandler = () => {
  process.on('unhandledRejection', acaUnhandledRejectionHandler);
}

export {
  addUnhandledRejectionHandler,
}

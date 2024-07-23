/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const acaUncaughtExceptionHandler = (error: any, origin: any) => {
  console.log(`UNCAUGHT_EXCEPTION_HANDLER time: ${Date.now()} pid: ${process.pid} origin: `, origin);
  console.log(`UNCAUGHT_EXCEPTION_HANDLER time: ${Date.now()} pid: ${process.pid} error: `, error);
  if (
    'true' === process.env.ACA_ON_UNHANDLED_EXCEPTION_KILL_APPLICATION
  ) {
    process.kill(process.pid, 'SIGTERM');
  }
};

const addUncaughtExceptionHandler = () => {
  process.on('uncaughtException', acaUncaughtExceptionHandler);
}

export {
  addUncaughtExceptionHandler,
}

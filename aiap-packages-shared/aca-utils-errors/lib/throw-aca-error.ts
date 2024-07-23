/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { createAcaError } from './create-aca-error';

const throwAcaError = (
  module: string,
  type: string,
  message: any,
  data: any = null
) => {
  const ERROR = createAcaError(
    module,
    type,
    message,
    data
  );
  throw ERROR;
}

export {
  throwAcaError,
}

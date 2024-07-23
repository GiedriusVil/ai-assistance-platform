/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import ramda from '@ibm-aca/aca-wrapper-ramda';

const process = async (
  socket,
  adapter,
  value,
) => {
  const clientId = adapter.getClientId(socket);
  const clientActivity = await adapter.utilsActivity.getClientActivity(clientId);
  if (
    adapter.utilsActivity.isChatInClosingState(clientActivity)
  ) {
    return;
  }
  const rawUpdate = {
    socket: socket,
  };
  let update = adapter.__formatUpdate(rawUpdate, clientId);

  //Assign metadata
  update = ramda.assocPath(['metadata', 'feedback'], value, update);

  adapter.__emitUpdate(update);
}

export {
  process,
}

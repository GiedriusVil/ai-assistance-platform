/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
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
  if (
    value == 'typing_on'
  ) {
    adapter.utilsTyping.setTypingStatus(clientId, true);
  } else if (
    value == 'typing_off'
  ) {
    adapter.utilsTyping.setTypingStatus(clientId, false);
  }
}

export {
  process,
}

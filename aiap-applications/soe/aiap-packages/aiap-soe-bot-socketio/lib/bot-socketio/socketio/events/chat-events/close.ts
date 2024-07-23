/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const process = (
  socket: any,
  adapter: any,
) => {
  const clientId = adapter.getClientId(socket);
  adapter.utilsActivity.setChatClosed(clientId);
  socket.disconnect();
};

const send = (
  socket: any,
  adapter: any,
  reason: any,
) => {
  const update = {
    type: 'close',
    value: {
      reason: reason,
    },
  };
  socket.send({ chat_event: update });
};

export {
  process,
  send,
}

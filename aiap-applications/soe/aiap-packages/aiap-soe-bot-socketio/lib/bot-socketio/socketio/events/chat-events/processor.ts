/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const chatEvents = require('./index');

const process = (
  socket: any,
  adapter: any,
  event: {
    type: any,
    value: any,
  },
) => {
  const EVENT_TYPE = event?.type;

  switch (EVENT_TYPE) {
    case 'close':
      chatEvents.close.process(socket, adapter, event.value);
      break;

    case 'feedback_conversation':
      chatEvents.feedbackConversation.process(socket, adapter, event.value);
      break;

    case 'feedback_message':
      chatEvents.feedbackMessage.process(socket, adapter, event.value);
      break;
  }
};

export {
  process,
}

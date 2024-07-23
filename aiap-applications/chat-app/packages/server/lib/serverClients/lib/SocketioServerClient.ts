/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  AbstractServerClient
} from './AbstractServerClient';

class SocketioServerClient extends AbstractServerClient {
  constructor(socket, parent) {
    super(socket, parent);
  }

  send(message) {
    this.client.send(message);
  }

  disconnect(reason = undefined) {
    this.client.disconnect(reason);
  }

  transfer(payload = undefined) {
    this.server.transfer(this.client, payload);
  }
}

export {
  SocketioServerClient
};

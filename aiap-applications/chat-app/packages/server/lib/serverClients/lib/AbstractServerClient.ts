/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
class AbstractServerClient {

  client: any;
  id: any;
  server: any;

  constructor(client, server) {
    this.client = client;
    this.id = client.id;
    this.server = server;
  }

  send(message) {
    throw new Error('You have to implement the method send!');
  }

  disconnect() {
    throw new Error('You have to implement the method disconnect!');
  }
}

export {
  AbstractServerClient
} 

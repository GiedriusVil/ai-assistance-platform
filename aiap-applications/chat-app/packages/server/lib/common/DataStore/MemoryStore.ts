/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
class MemoryStore {

  items: any;
  itemDeleteTimeouts: any;
  deletionTimeout: number;
  
  constructor(config) {
    this.items = {};
    this.itemDeleteTimeouts = {};
    this.deletionTimeout = config.sessionDeleteTimeout;
  }

  get(id) {
    const item = this.items[id];
    if (item == undefined) {
      return undefined;
    } else {
      this.__stopItemDeletion(id);
    }
    return item;
  }

  set(id, item) {
    this.items[id] = item;
  }

  remove(id) {
    this.__startItemDeletion(id);
  }

  __startItemDeletion(id) {
    this.itemDeleteTimeouts[id] = setTimeout(() => {
      delete this.items[id];
      delete this.itemDeleteTimeouts[id];
    }, this.deletionTimeout);
  }

  __stopItemDeletion(id) {
    clearTimeout(this.itemDeleteTimeouts[id]);
    delete this.itemDeleteTimeouts[id];
  }
}

export {
  MemoryStore
} 

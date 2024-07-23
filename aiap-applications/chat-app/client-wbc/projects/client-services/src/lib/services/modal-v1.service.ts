/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

@Injectable()
export class ModalServiceV1 {
  private modals: any[] = [];

  add(modal: any) {
    // add modal to array of active modals
    this.modals.push(modal);
  }

  remove(id: string) {
    // remove one instance of modal from array of active modals

    const modal = this.modals.find((x) => x.id === id);
    const index = this.modals.indexOf(modal);
    if (index > -1) {
      this.modals.splice(index, 1);
    }
  }

  open(id: string) {
    // open modal specified by id
    const modal = this.modals.find((x) => x.id === id);
    modal.open();
  }

  close(id: string) {
    // close modal specified by id
    const modal = this.modals.find((x) => x.id === id);
    modal.close();
  }

  duplicate(id: string) {
    // Duplicate existing modal because other components could remove it.
    const modal = this.modals.find((x) => x.id === id);
    this.modals.push(modal);
  }
}

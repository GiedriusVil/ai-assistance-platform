/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import { Observable, Observer, Subscription } from 'rxjs';
import { filter, share } from 'rxjs/operators';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { _debugX } from "client-utils";

@Injectable()
export class BasketServiceV1 {

  static getClassName() {
    return 'BasketServiceV1';
  }

  observable: Observable<any>;
  observer: Observer<any>;

  basket: any;

  constructor() {
    this.observable = new Observable<any>((observer: Observer<any>) => {
      this.observer = observer;
    }).pipe(share());
  }

  subscribe(type: string, callback: any): Subscription {
    const RET_VAL = this.observable.pipe(
      filter((event: any) => {
        _debugX(BasketServiceV1.getClassName(), 'on_event_filter', { event })
        let retVal = type === event?.type;
        return retVal;
      })
    ).subscribe(callback);
    return RET_VAL;
  }

  broadcast(type: string, data: any) {
    if (this.observer != null) {
      this.basket = data;
      const EVENT = {
        type: type,
        data: this.basket,
      };
      this.observer.next(EVENT);
    }
  }

  destroy(subscription: Subscription) {
    subscription.unsubscribe();
  }

  getBasket() {
    return this.basket;
  }

  getBasketItemsQty(): number {
    let retVal = 0;
    const BUY_ITEMS = ramda.path(['items'], this.basket);
    if (
      lodash.isArray(BUY_ITEMS)
    ) {
      retVal = BUY_ITEMS.length;
    }
    return retVal;
  }

  static EVENT = {
    CHANGED: 'changed'
  }

}

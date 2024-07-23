/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX
} from 'client-utils';

@Component({
  selector: 'aca-chat-basket-component',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit, OnDestroy {

  static getClassName() {
    return 'BasketComponent';
  }

  @Input() basket: any;
  @Input() configuration: any;

  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();

  _state = {
    basket: undefined,
  }

  _configuration: any = {
    productList: {
      pagination: {
        page: 1,
        size: 3,
      },
      enable: {
        actions: true,
        add: false,
        remove: true,
        quantity: true,
        submit: true,
        selection: false,
      }
    }
  }

  constructor() { }

  ngOnInit(): void {
    this._state.basket = lodash.cloneDeep(this.basket);
    this._configuration = lodash.cloneDeep(this.configuration);
    _debugX(BasketComponent.getClassName(), 'ngOnInit', { this_state: this._state });
  }

  ngOnDestroy(): void { }

  isBasketEmpty(): boolean {
    const BASKET_ITEMS = ramda.path(['basket', 'items'], this._state);
    let retVal = true;
    if (
      !lodash.isEmpty(BASKET_ITEMS) &&
      lodash.isArray(BASKET_ITEMS)
    ) {
      retVal = false;
    }
    return retVal;
  }

  isSubmitVisible(): boolean {
    let retVal = false;
    if (
      this._configuration.productList.enable.actions &&
      this._configuration.productList.enable.submit
    ) {
      retVal = true;
    }
    return retVal;
  }

  handleSubmitSubmitEvent() {
    const EVENT = {
      type: BasketComponent.EVENTS.SUBMIT_BASKET
    }
    _debugX(BasketComponent.getClassName(), 'handleSubmitSubmitEvent', EVENT);
    this.onSubmit.emit(EVENT);
  }

  handleBasketCancelEvent() {
    const EVENT = {
      type: BasketComponent.EVENTS.CANCEL_BASKET
    }
    _debugX(BasketComponent.getClassName(), 'handleBasketCancelEvent', EVENT);
    this.onSubmit.emit(EVENT);
  }


  static EVENTS = {
    SUBMIT_BASKET: 'SUBMIT_BASKET',
    CANCEL_BASKET: 'CANCEL_BASKET'
  }

}

/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Output, OnDestroy } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  BasketServiceV1,
} from "client-services";

import {
  _debugX
} from "client-utils";

@Component({
  selector: 'aca-basket-view',
  templateUrl: './basket.view.html',
  styleUrls: ['./basket.view.scss']
})
export class BasketView implements OnInit, OnDestroy {

  static getClassName() {
    return 'BasketView';
  }

  _state = {
    basketSubscription: undefined,
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
        selection: true,
      }
    }
  }

  constructor(
    private basketService: BasketServiceV1,
  ) { }

  ngOnInit(): void {
    this._state.basketSubscription = this.basketService.subscribe(BasketServiceV1.EVENT.CHANGED, (event: any) => {
      _debugX(BasketView.getClassName(), 'event', { event });
      this._state.basket = ramda.path(['data'], event);
    });
    this._state.basket = this.basketService.getBasket();
    _debugX(BasketView.getClassName(), 'ngOnInit', { this_state: this._state });
  }

  ngOnDestroy(): void {
    this.basketService.destroy(this._state.basketSubscription);
  }

}

/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  ChatWidgetServiceV1,
  SessionServiceV1,
} from 'client-services';

import { _debugX } from 'client-utils';

@Component({
  selector: 'aca-chat-basket-attachment',
  templateUrl: './basket.attachment.html',
  styleUrls: ['./basket.attachment.scss']
})
export class BasketAttachment implements OnInit {

  static getClassName() {
    return 'BasketAttachment';
  }

  @Input() message: any;

  @Output() userActionEvent = new EventEmitter<any>();

  _state = {
    basket: undefined,
  }
  _configuration: any = {
    productList: {
      pagination: {
        page: 1,
        size: 5,
      },
      enable: {
        actions: true,
        add: false,
        remove: true,
        quantity: false,
        submit: false,
        selection: false,
      }
    }
  }

  basketDetails: any = {
    address: '',
    needByDate: '',
    purchasingUnit: '',
    companyCode: '',
    reqProfitCenter: '',
    deliverToAttention: '',
    onBehalfOf: ''
  }

  total: string = "0.00";
  currency: string;
  quantity: number = 0;

  constructor(
    private sessionService: SessionServiceV1,
    private chatWidgetService: ChatWidgetServiceV1
  ) { }

  ngOnInit(): void {
    const BASKET = ramda.path(['attachment', 'basket'], this.message);
    this.checkIfImageExists(BASKET.items);
    this._state.basket = BASKET;
    this.currency = this._state.basket.items[0]?.currency || " ";
    this.quantity = this._state.basket.items.length;
    this.calculateTotal();
    this.initBasketDetails();
  }

  initBasketDetails(): void {
    const BASKET_DETAILS = ramda.path(['attachment', 'basketDetails'], this.message);
    this.basketDetails.address = ramda.pathOr('', ['address'], BASKET_DETAILS);
    this.basketDetails.needByDate = ramda.pathOr('', ['needByDate'], BASKET_DETAILS);
    this.basketDetails.purchasingUnit = ramda.pathOr('', ['purchasingUnit'], BASKET_DETAILS);
    this.basketDetails.reqProfitCenter = ramda.pathOr('', ['reqProfitCenter'], BASKET_DETAILS);
    this.basketDetails.deliverToAttention = ramda.pathOr('', ['deliverToAttention'], BASKET_DETAILS);
    this.basketDetails.onBehalfOf = ramda.pathOr('', ['onBehalfOf'], BASKET_DETAILS);
  }

  checkIfImageExists(products) {
    products.forEach(product => {
      const IMAGE_URL = ramda.path(['image'], product);
      if (lodash.isEmpty(IMAGE_URL)) {
        product.image = this.getDefaultProductIcon();
      }
    });
  }

  getDefaultProductIcon() {
    const ASSETS_URL = this.chatWidgetService.getChatAppHostUrl() + "/en-US/assets";
    const FILE_URL = ramda.path(['engagement', 'chatApp', 'assets', 'icons', 'chatWindow', 'productList', 'defaultImage', 'url'], this.sessionService.getSession());
    const FILE_NAME = ramda.pathOr('no-image.gif', ['engagement', 'chatApp', 'assets', 'icons', 'chatWindow', 'productList', 'defaultImage', 'fileName'], this.sessionService.getSession());
    if (!lodash.isEmpty(FILE_URL)) {
      return FILE_URL;
    }
    return `${ASSETS_URL}/${FILE_NAME}`;
  }

  handleBasketSubmitEvent(event) {
    _debugX(BasketAttachment.getClassName(), 'handleBasketSubmitEvent', {
      this_state: this._state,
      event: event
    });
    const MESSAGE: any = {
      type: 'user',
      text: 'Submit',
      timestamp: new Date().getTime()
    }
    const USER_ACTION_EVENT = {
      type: 'POST_MESSAGE',
      data: MESSAGE
    }
    this.userActionEvent.emit(USER_ACTION_EVENT);
  }

  handleBasketCancelEvent(event) {
    _debugX(BasketAttachment.getClassName(), 'handleBasketCancelEvent', {
      this_state: this._state,
      event: event
    });
    const MESSAGE: any = {
      type: 'user',
      text: 'Cancel',
      timestamp: new Date().getTime()
    }
    const USER_ACTION_EVENT = {
      type: 'POST_MESSAGE',
      data: MESSAGE
    }
    this.userActionEvent.emit(USER_ACTION_EVENT);
  }
  private calculateTotal(): void {
    let total: number = 0;
    if (this._state.basket.items && this._state.basket.items.length > 0) {
      this._state.basket.items.forEach(item => {
        let priceNumber = Number(item.unitPrice);
        if (priceNumber) {
          total = total + priceNumber;
        }
      });
      this.total = total.toFixed(2);
    }
  }

  onExpandProducts(id: string): void {
    let parElement = document.getElementById(id);
    let elementText = document.getElementById(id).textContent;
    let textToAdd;
    if (elementText === '+') {
      textToAdd = '-';
    } else {
      textToAdd = '+';
    }
    parElement.textContent = textToAdd;
  }

  onExpandDetails(id: string): void {
    let parElement = document.getElementById(id);
    let elementText = document.getElementById(id).textContent;
    let textToAdd;
    if (elementText === 'See All') {
      textToAdd = 'Close';
    } else {
      textToAdd = 'See All';
    }
    parElement.textContent = textToAdd;
  }
}

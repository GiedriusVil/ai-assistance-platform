/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  ChatWidgetServiceV1,
  SessionServiceV1,
  MessagesServiceV1
} from 'client-services';

import { _debugX, SENDER_ACTIONS, PRODUCT_EVENT_TYPE } from 'client-utils';

@Component({
  selector: 'aca-chat-product-list-attachment',
  templateUrl: './product-list.attachment.html',
  styleUrls: ['./product-list.attachment.scss']
})
export class ProductListAttachment implements OnInit {

  static getClassName() {
    return 'ProductListAttachment';
  }

  @Input() message: any;
  @Input() index: any;
  @Output() userActionEvent = new EventEmitter<any>();

  _state = {
    attributes: [],
    products: [],
    configuration: {
      pagination: {
        page: 1,
        size: 3,
      },
      enable: {
        actions: true,
        add: true,
        remove: false,
        quantity: false,
      },
    },
    content: {
      enabled: true
    },
  }

  constructor(
    private sessionService: SessionServiceV1,
    private chatWidgetService: ChatWidgetServiceV1,
    private messagesService: MessagesServiceV1,
  ) { }

  ngOnInit(): void {
    _debugX(ProductListAttachment.getClassName(), 'before', {
      this_state: this._state,
      this_message: this.message
    });
    const PRODUCTS = ramda.path(['attachment', 'attachments'], this.message);
    if (
      !lodash.isEmpty(PRODUCTS) &&
      lodash.isArray(PRODUCTS)
    ) {
      this.checkIfImageExists(PRODUCTS);
      this._state.products = PRODUCTS;
    }
    this._state.attributes = ramda.path(['attachment', 'attributes'], this.message);
    _debugX(ProductListAttachment.getClassName(), 'after', {
      this_state: this._state,
      this_message: this.message
    });
  }

  handleProductEvent(event: any): any {
    const TYPE = ramda.pathOr(undefined, ['type'], event);
    const DATA = ramda.pathOr(undefined, ['data'], event);
    if (TYPE && DATA) {
      if (TYPE === PRODUCT_EVENT_TYPE.PRODUCT_SELECT) {
        this.handleProductSelectEvent(DATA);
      }
    }
  }

  onButtonClick(message: any) {
    if (!this._state.content.enabled) {
      return;
    }
    const MESSAGE: any = {
      type: 'user',
      text: message,
      timestamp: new Date().getTime()
    }
    const EVENT = {
      type: 'POST_MESSAGE',
      data: MESSAGE
    }
    _debugX(ProductListAttachment.getClassName(), 'handleRowClick', {
      this_state: this._state,
      event: EVENT
    });
    this.userActionEvent.emit(EVENT);
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
    const ASSETS_URL = this.chatWidgetService.getChatAppHostUrl() + '/en-US/assets';
    const FILE_URL = ramda.path(['engagement', 'chatApp', 'assets', 'icons', 'chatWindow', 'productList', 'defaultImage', 'url'], this.sessionService.getSession());
    const FILE_NAME = ramda.pathOr('no-image.gif', ['engagement', 'chatApp', 'assets', 'icons', 'chatWindow', 'productList', 'defaultImage', 'fileName'], this.sessionService.getSession());
    if (!lodash.isEmpty(FILE_URL)) {
      return FILE_URL;
    }
    return `${ASSETS_URL}/${FILE_NAME}`;
  }

  handleProductSelectEvent(data: any): any {
    const CURRENT_TIMESTAMP = Date.now();
    const EVENT = {
      type: 'POST_MESSAGE',
      data: {
        type: 'user',
        text: data.itemName,
        timestamp: new Date().getTime(),
        sender_action: {
          // type: SENDER_ACTIONS.ITEM_SELECTED,
          type: '_itemSelected',
          data: {
            ...data,
            selectedTimestamp: CURRENT_TIMESTAMP,
          },
        },
      }
    };
    this.userActionEvent.emit(EVENT);
  }

}

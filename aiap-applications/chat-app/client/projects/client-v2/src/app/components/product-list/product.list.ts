/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import * as lodash from 'lodash'
import * as ramda from 'ramda';

import { _debugX } from "client-utils";

const EVENT_TYPE: any = {
  PRODUCT_SELECT: 'productSelect',
  PRODUCT_REMOVE: 'productRemove',
  INCREASE_QUANTITY: 'increaseQuantity',
  REDUCE_QUANTITY: 'reduceQuantity',
  PRODUCT_SELECTION: 'productSelection',
}

@Component({
  selector: 'aca-chat-product-list',
  templateUrl: './product.list.html',
  styleUrls: ['./product.list.scss']
})
export class ProductList implements OnInit {

  static getClassName() {
    return 'ProductList';
  }

  @Input() products: Array<any>;
  @Input() configuration: any;

  @Output() onProductEvent = new EventEmitter<any>();

  collectionSize: number;

  _state = {
    products: [],
    productsTotalQty: 0,
    selectedProduct: undefined,
    pagination: {
      page: 1,
      size: 5
    },
    enable: {
      actions: true,
      add: true,
      remove: true,
      quantity: true,
      selection: false,
    },
  }

  constructor() { }

  ngOnInit(): void {
    this._state.pagination.size = this.configuration?.pagination?.size || 5;
    this._state.pagination.page = this.configuration?.pagination?.page || 1;
    this._state.productsTotalQty = this.products.length;
    this.initEnableConfiguration();
    this.refresh();
  }

  initEnableConfiguration(): void {
    this._state.enable.actions = ramda.pathOr(false, ['enable', 'actions'], this.configuration);
    this._state.enable.add = ramda.pathOr(false, ['enable', 'add'], this.configuration);
    this._state.enable.remove = ramda.pathOr(false, ['enable', 'remove'], this.configuration);
    this._state.enable.quantity = ramda.pathOr(false, ['enable', 'quantity'], this.configuration);
    this._state.enable.selection = ramda.pathOr(false, ['enable', 'selection'], this.configuration);
  }

  refresh(): void {
    const PAGINATION_PAGE = this._state.pagination.page;
    const PAGINATION_SIZE = this._state.pagination.size;
    this._state.products = this.products
      .map((item, index) => ({ id: index + 1, ...item }))
      .slice((PAGINATION_PAGE - 1) * PAGINATION_SIZE, (PAGINATION_PAGE - 1) * PAGINATION_SIZE + PAGINATION_SIZE);

    _debugX(ProductList.getClassName(), 'refresh', {
      this_products: this.products,
      this_configuration: this.configuration,
      this_state: this._state,
    });
  }

  formatDateTime(timestamp: any): string {
    const DATE_TIME = new Date(Number(timestamp));
    const YEAR = DATE_TIME.getFullYear();
    const MONTH = DATE_TIME.toLocaleString('en-us', { month: 'short' });
    const DAY = DATE_TIME.getDate();

    const AMPM = DATE_TIME.getHours() >= 12 ? 'PM' : 'AM';
    let hours = DATE_TIME.getHours() % 12;
    let minutesAsString = DATE_TIME.getMinutes().toString();
    let minutesAsNumber = DATE_TIME.getMinutes();

    hours = hours ? hours : 12; // the hour '0' should be '12'
    const MINUTES = minutesAsNumber < 10 ? '0' + minutesAsString : minutesAsString;
    const TIME_STRING = hours + ':' + MINUTES + ' ' + AMPM;

    const DATE_TIME_STING = DAY + ' ' + MONTH + ' ' + YEAR + ' ' + TIME_STRING;
    return DATE_TIME_STING;
  }

  isAddBtnVisible(): boolean {
    let retVal = false;
    if (
      this._state.enable.actions &&
      this._state.enable.add &&
      !this._state.selectedProduct
    ) {
      retVal = true;
    }
    return retVal;
  }

  isRemoveBtnVisible(): boolean {
    let retVal = false;
    if (
      this._state.enable.actions &&
      this._state.enable.remove
    ) {
      retVal = true;
    }
    return retVal;
  }

  handleProductSelectEvent(product: any): void {
    _debugX(ProductList.getClassName(), 'handleProductSelectEvent', {
      product
    });
    if (
      this._state.enable.actions &&
      this._state.enable.add
    ) {
      const EVENT = {
        type: EVENT_TYPE.PRODUCT_SELECT,
        data: product,
      }
      this._state.selectedProduct = product;
      this.onProductEvent.emit(EVENT);
    }
  }

  handleProductRemoveEvent(product: any): void {
    _debugX(ProductList.getClassName(), 'handleProductRemoveEvent', {
      product
    });
    if (
      this._state.enable.actions &&
      this._state.enable.remove
    ) {
      const EVENT = {
        type: EVENT_TYPE.PRODUCT_REMOVE,
        data: product,
      }
      this.onProductEvent.emit(EVENT);
    }
  }

  handleProductQtyIncreaseEvent(product: any): void {
    _debugX(ProductList.getClassName(), 'handleProductQuantityIncreseEvent', {
      product
    });
    if (
      this._state.enable.actions &&
      this._state.enable.quantity
    ) {
      const EVENT = {
        type: EVENT_TYPE.INCREASE_QUANTITY,
        data: product,
      }
      this.onProductEvent.emit(EVENT);
    }
  }

  handleProductQtyReduceEvent(product: any): void {
    _debugX(ProductList.getClassName(), 'handleProductQuantityReduceEvent', {
      product
    });
    if (
      this._state.enable.actions &&
      this._state.enable.quantity
    ) {
      const EVENT = {
        type: EVENT_TYPE.REDUCE_QUANTITY,
        data: product,
      }
      this.onProductEvent.emit(EVENT);
    }
  }

  //Handle checkbox selection event
  handleProductSelectionEvent(product: any): void {
    _debugX(ProductList.getClassName(), 'handleProductSelectionEvent', {
      product
    });
    if (
      this._state.enable.actions &&
      this._state.enable.selection
    ) {
      const EVENT = {
        type: EVENT_TYPE.PRODUCT_SELECTION,
        data: product,
      }
      this.onProductEvent.emit(EVENT);
    }
  }

  isProductStatusVisible(product: any) {
    let retVal = false;
    if (
      !lodash.isEmpty(this._state?.selectedProduct) &&
      !lodash.isEmpty(product) &&
      lodash.isEqual(this._state?.selectedProduct, product)
    ) {
      retVal = true;
    }
    return retVal;
  }

  isQuantityVisible(): boolean {
    let retVal = false;
    if (
      this._state.enable.actions &&
      this._state.enable.quantity
    ) {
      retVal = true;
    }
    return retVal;
  }

  isCheckboxVisible(): boolean {
    let retVal = false;
    if (
      this._state.enable.actions &&
      this._state.enable.selection
    ) {
      retVal = true;
    }
    return retVal;
  }

  isPaginationVisible(): boolean {
    let retVal = false;
    if (
      this._state.productsTotalQty > this._state.pagination.size
    ) {
      retVal = true;
    }
    return retVal;
  }

}

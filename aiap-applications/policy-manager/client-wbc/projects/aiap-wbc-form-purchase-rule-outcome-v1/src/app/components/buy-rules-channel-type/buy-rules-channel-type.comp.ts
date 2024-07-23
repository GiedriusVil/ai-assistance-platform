/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, EventEmitter, Input, Output, OnDestroy } from '@angular/core';

import {
  CHANNEL_TYPES
} from 'client-utils';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

@Component({
  selector: 'aca-buy-rules-channel-type',
  templateUrl: './buy-rules-channel-type.comp.html',
  styleUrls: ['./buy-rules-channel-type.comp.scss'],
})
export class BuyRulesChannelType implements OnInit, OnDestroy {

  static getClassName() {
    return 'BuyRulesChannelType';
  }

  @Input() rule: any;
  @Input() showSelectionColumn: any;

  @Output() onShowBuyRuleSupplierSaveModal = new EventEmitter<any>();
  @Output() onShowBuyRuleSupplierDeleteModal = new EventEmitter<any>();


  ngOnInit() { }

  ngOnDestroy() { }

  public get channelTypes() {
    return CHANNEL_TYPES;
  }

  onSelectSupplier() {
    _debugX(BuyRulesChannelType.getClassName(), `onSelectSupplier`, {});
    this.rule.channelType = this.channelTypes.supplierCatalog;
  }

  onSelectFree() {
    _debugX(BuyRulesChannelType.getClassName(), `onSelectFree`, {});
    this.rule.channelType = this.channelTypes.freeText;
  }

  onSelectPunch() {
    _debugX(BuyRulesChannelType.getClassName(), `onSelectPunch`, {});
    this.rule.channelType = this.channelTypes.punchOut;
  }

  handleShowBuyRuleSupplierSaveModal(value) {
    _debugX(BuyRulesChannelType.getClassName(), `handleShowBuyRuleSupplierSaveModal`, { value });
    this.onShowBuyRuleSupplierSaveModal.emit(value);
  }

  handleShowBuyRulesSuppliersDeleteModal(value) {
    _debugX(BuyRulesChannelType.getClassName(), `handleShowBuyRulesSuppliersDeleteModal`, { value });
    this.onShowBuyRuleSupplierDeleteModal.emit(value);
  }

}

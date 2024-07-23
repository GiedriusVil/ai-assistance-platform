/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { NotificationService } from 'carbon-components-angular';

import { _debugX, _error } from 'client-shared-utils';

import {
  BuyRulesSuppliersSaveModal,
} from '../../components/buy-rules-suppliers-save-modal/buy-rules-suppliers-save.modal';

import {
  BuyRulesSuppliersDeleteModal,
} from '../../components/buy-rules-suppliers-delete-modal/buy-rules-suppliers-delete.modal';

@Component({
  selector: 'aca-buy-rules-suppliers-tab',
  templateUrl: './buy-rules-suppliers.tab.html',
  styleUrls: ['./buy-rules-suppliers.tab.scss']
})
export class BuyRulesSuppliersTab implements OnInit, OnDestroy {

  static getClassName() {
    return 'BuyRulesSuppliersTab';
  }

  @ViewChild('buyRulesSuppliersSaveModal') buyRulesSuppliersSaveModal: BuyRulesSuppliersSaveModal;
  @ViewChild('buyRulesSuppliersDeleteModal') buyRulesSuppliersDeleteModal: BuyRulesSuppliersDeleteModal;

  @Output() onClose = new EventEmitter<any>();

  @Input() rule;
  @Output() ruleChange = new EventEmitter<any>();

  private _destroyed$: Subject<void> = new Subject();

  _state = {
    actions: [],
    selectedActions: [],
  }
  state = lodash.cloneDeep(this._state);

  constructor() { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  handleShowBuyRuleSupplierSaveModal(event: any = undefined) {
    const RULE_ID = this.rule?.id;
    const RULE_SUPPLIER_ID = event?.value?.id;
    _debugX(BuyRulesSuppliersTab.getClassName(), 'handleShowBuyRuleSupplierSaveModal', { event, RULE_ID, RULE_SUPPLIER_ID });
    this.buyRulesSuppliersSaveModal.show(RULE_ID, RULE_SUPPLIER_ID);
  }

  handleShowBuyRuleSuppliersDeleteModal(ids): void {
    _debugX(BuyRulesSuppliersTab.getClassName(), 'handleShowBuyRuleSuppliersDeleteModal', { ids });
    this.buyRulesSuppliersDeleteModal.show(ids);
  }
}

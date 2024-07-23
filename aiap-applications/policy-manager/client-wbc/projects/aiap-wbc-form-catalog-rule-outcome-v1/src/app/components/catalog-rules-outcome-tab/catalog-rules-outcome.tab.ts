/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  _error,
  _errorX,
} from 'client-shared-utils';

import { CatalogRulesCatalogSaveModal } from '../catalog-rules-catalog-save-modal/catalog-rules-catalog-save.modal';
import { CatalogRulesCatalogDeleteModal } from '../catalog-rules-catalog-delete-modal/catalog-rules-catalog-delete.modal';

@Component({
  selector: 'aca-catalog-rules-outcome-tab',
  templateUrl: './catalog-rules-outcome.tab.html',
  styleUrls: ['./catalog-rules-outcome.tab.scss']
})
export class CatalogRulesOutcomeTab implements OnInit, OnDestroy {
  static getClassName() {
    return 'CatalogRulesOutcomeTab';
  }

  @ViewChild('catalogRulesCatalogsSaveModal') catalogRulesCatalogsSaveModal: CatalogRulesCatalogSaveModal;
  @ViewChild('catalogRulesCatalogsDeleteModal') catalogRulesCatalogsDeleteModal: CatalogRulesCatalogDeleteModal;

  @Input() rule = undefined;
  @Output() ruleChange = new EventEmitter<any>();

  private _destroyed$: Subject<void> = new Subject();

  constructor() { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  handleShowCatalogRuleCatalogsDeleteModal(ids): void {
    _debugX(CatalogRulesOutcomeTab.getClassName(), 'handleShowCatalogRuleCatalogsDeleteModal', { ids });
    this.catalogRulesCatalogsDeleteModal.show(ids);
  }

  handleShowOutcomeCatalogSaveModal(event: any = undefined) {
    const RULE_ID = this.rule?.id;
    const CATALOG_ID = event?.value?.id;
    _debugX(CatalogRulesOutcomeTab.getClassName(), 'handleShowCatalogRuleCatalogsSaveModal', { RULE_ID, event });
    this.catalogRulesCatalogsSaveModal.show(RULE_ID, CATALOG_ID);
  }

}

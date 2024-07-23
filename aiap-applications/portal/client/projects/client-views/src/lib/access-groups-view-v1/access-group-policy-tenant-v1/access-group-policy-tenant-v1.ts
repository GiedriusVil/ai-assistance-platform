/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnChanges, Output, EventEmitter, SimpleChanges, ViewChild } from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  CheckboxTreeV1,
} from 'client-components';

@Component({
  selector: 'aiap-access-group-policy-tenant-v1',
  templateUrl: './access-group-policy-tenant-v1.html',
  styleUrls: ['./access-group-policy-tenant-v1.scss']
})
export class AccessGroupPolicyTenantV1 implements OnInit, OnChanges {

  static getClassName() {
    return 'AccessGroupPolicyTenantV1';
  }

  @ViewChild('policyTenantCheckboxTree', { static: true }) policyTenantCheckboxTree: CheckboxTreeV1;

  @Output() onAddPolicy = new EventEmitter();

  _value = {
    tenant: undefined,
    application: undefined,
    assistant: undefined,
    views: undefined,
  };
  value = lodash.cloneDeep(this._value);
  isAddAllEnabled = false;
  applicationViews: any[];

  constructor() {
    //
  }

  ngOnInit(): void {
    this.applicationViews = lodash.cloneDeep(this.value?.application?.configuration?.views || []);
    _debugX(AccessGroupPolicyTenantV1.getClassName(), 'ngOnInit',
      {
        this_applicationViews: this.applicationViews,
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    _debugX(AccessGroupPolicyTenantV1.getClassName(), 'ngOnChanges',
      {
        changes,
      });
  }

  handleClearPolicies(): void {
    _debugX(AccessGroupPolicyTenantV1.getClassName(), this.handleClearPolicies.name, { this_value: this.value });
    this.value = lodash.cloneDeep(this._value);
  }

  handleAddAllApplicationPolicies(): void {
    this.policyTenantCheckboxTree.handleSelectAll({ checked: true });
    this.handleAddPolicies();
  }

  handleAddPolicies(): void {
    const VIEWS_CLONE = lodash.cloneDeep(this.value?.application?.configuration?.views) || [];
    const SELECTED_VIEWS = [];
    VIEWS_CLONE.forEach(view => {
      const SINGLE_VIEWS = view?.views;
      if (lodash.isArray(SINGLE_VIEWS)) {
        const FILTERED_VIEWS = [];
        SINGLE_VIEWS.forEach(singleView => {
          singleView.name = `${view.name} ${singleView.name}`;
          if (singleView?.checked) {
            FILTERED_VIEWS.push(singleView);
          } else {
            const SELECTED_VIEW_ACTIONS = singleView?.actions?.filter(action => action?.checked);
            if (!lodash.isEmpty(SELECTED_VIEW_ACTIONS)) {
              singleView.actions = SELECTED_VIEW_ACTIONS;
              FILTERED_VIEWS.push(singleView);
            }
          }
        });
        SELECTED_VIEWS.push(...FILTERED_VIEWS);
      } else {
        const SELECTED_VIEW_ACTIONS = view?.actions?.filter(action => action?.checked);
        if (!lodash.isEmpty(SELECTED_VIEW_ACTIONS) || view?.checked) {
          view.actions = SELECTED_VIEW_ACTIONS;
          SELECTED_VIEWS.push(view);
        }
      }
    });
    this.value.views = SELECTED_VIEWS;
    _debugX(AccessGroupPolicyTenantV1.getClassName(), this.handleAddPolicies.name,
      {
        VIEWS_CLONE,
        SELECTED_VIEWS,
      });

    this.onAddPolicy.emit(this.value);

    this.policyTenantCheckboxTree.resetCheckboxes();
  }

  handleTenantValueChange(value): void {
    _debugX(AccessGroupPolicyTenantV1.getClassName(), 'handleTenantValueChange',
      {
        value,
      });

    const NEW_VALUE = lodash.cloneDeep(value);
    this.value = NEW_VALUE;
  }

  handleValueChange(value): void {
    this.resetAssitants(value);
    this.setIsAddAllEnabled(value);
  }

  setIsAddAllEnabled(value: any) {
    _debugX(AccessGroupPolicyTenantV1.getClassName(), 'setIsAddAllEnabled',
      {
        value,
      });

    const APPLICATION = lodash.cloneDeep(value?.application);
    this.applicationViews = APPLICATION?.configuration?.views;

    const IS_TENANT = value?.tenant;
    const IS_APPLICATION_ID = APPLICATION?.id;
    const IS_ASSISTANT_REQUIRED = APPLICATION?.configuration?.requiresAssistant;
    const IS_ASSISTANT_ID = value?.assistant?.id;

    this.isAddAllEnabled = IS_TENANT && IS_APPLICATION_ID && (IS_ASSISTANT_REQUIRED ? IS_ASSISTANT_ID : true);
  }

  resetAssitants(value) {
    const IS_ASSISTANT_REQUIRED = value?.application?.configuration?.requiresAssistant;
    if (!IS_ASSISTANT_REQUIRED) {
      this.value.assistant = undefined;
    }
  }

  handleSearch(event: any) {
    _debugX(AccessGroupPolicyTenantV1.getClassName(), this.handleSearch.name,
      {
        event,
      });

    const FOUND_VIEWS = event?.views;
    if (lodash.isArray(FOUND_VIEWS)) {
      const APPLICATION_CLONE = lodash.cloneDeep(this.value.application);
      APPLICATION_CLONE.configuration.views = FOUND_VIEWS;
      this.value.application = APPLICATION_CLONE;
    }
  }
}

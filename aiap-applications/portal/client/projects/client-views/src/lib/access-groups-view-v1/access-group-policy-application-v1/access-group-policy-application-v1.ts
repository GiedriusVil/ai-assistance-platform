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
  selector: 'aiap-access-group-policy-application-v1',
  templateUrl: './access-group-policy-application-v1.html',
  styleUrls: ['./access-group-policy-application-v1.scss']
})
export class AccessGroupPolicyApplicationV1 implements OnInit, OnChanges {

  static getClassName() {
    return 'AccessGroupPolicyApplicationV1';
  }

  @ViewChild('policyApplicationCheckboxTree', { static: true }) policyApplicationCheckboxTree: CheckboxTreeV1;

  @Output() onAddPolicy = new EventEmitter();

  _value = {
    views: undefined,
    allViews: undefined,
  };
  value = lodash.cloneDeep(this._value);

  _selection = {
    application: undefined,
    views: undefined,
  };
  selection = lodash.cloneDeep(this._selection);

  allViews: any[];
  isAddAllEnabled = false;

  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }

  ngOnChanges(changes: SimpleChanges): void {
    _debugX(AccessGroupPolicyApplicationV1.getClassName(), this.ngOnChanges.name,
      {
        changes,
      });

  }

  handleClearPolicies(): void {
    _debugX(AccessGroupPolicyApplicationV1.getClassName(), this.handleClearPolicies.name,
      {
        this_selection: this.selection,
      });
    this.selection = lodash.cloneDeep(this._selection);
  }

  handleAddAllApplicationPolicies(): void {
    this.policyApplicationCheckboxTree.handleSelectAll({ checked: true });
    this.handleAddPolicies();
  }

  handleAddPolicies(): void {
    const VIEWS_CLONE = lodash.cloneDeep(this.value.views);
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
    this.selection.views = SELECTED_VIEWS;
    _debugX(AccessGroupPolicyApplicationV1.getClassName(), this.handleAddPolicies.name,
      {
        VIEWS_CLONE,
        SELECTED_VIEWS,
      });

    this.onAddPolicy.emit(this.selection);

    this.policyApplicationCheckboxTree.resetCheckboxes();
  }

  handleApplicationsSelect(application: any): void {
    this.selection.application = application;
    this.value.views = application?.configuration?.views;
    this.value.allViews = application?.configuration?.views;
    _debugX(AccessGroupPolicyApplicationV1.getClassName(), this.handleApplicationsSelect.name,
      {
        this_selection: this.selection,
        application,
      });
  }

  handleSearch(event: any) {
    _debugX(AccessGroupPolicyApplicationV1.getClassName(), this.handleSearch.name,
      {
        event,
      });

    const FOUND_VIEWS = event?.views;
    if (lodash.isArray(FOUND_VIEWS)) {
      this.value.views = FOUND_VIEWS;
    }
  }
}

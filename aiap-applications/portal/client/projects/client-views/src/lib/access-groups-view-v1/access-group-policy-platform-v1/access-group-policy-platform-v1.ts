/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  AccessGroupsServiceV1,
} from 'client-services';

import {
  BaseComponentV1,
} from 'client-shared-components';

import {
  CheckboxTreeV1,
} from 'client-components';

@Component({
  selector: 'aiap-access-group-policy-platform-v1',
  templateUrl: './access-group-policy-platform-v1.html',
  styleUrls: ['./access-group-policy-platform-v1.scss']
})
export class AccessGroupPolicyPlatformV1 extends BaseComponentV1 implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'AccessGroupPolicyPlatformV1';
  }

  @ViewChild('policyPlatformCheckboxTree', { static: true }) policyPlatformCheckboxTree: CheckboxTreeV1;

  @Input() accessGroup;
  @Output() accessGroupChange = new EventEmitter<any>();

  _selection = {
    views: [],
    view: undefined,
  }
  selection = lodash.cloneDeep(this._selection);

  search = '';

  constructor(
    private accessGroupsService: AccessGroupsServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    this.superNgOnInit();
    this.resetSelections();
  }

  ngOnChanges(changes: SimpleChanges): void {
    _debugX(AccessGroupPolicyPlatformV1.getClassName(), 'ngOnChanges',
      {
        changes,
      });

    this.resetSelections();
  }

  ngOnDestroy(): void {
    this.superNgOnDestroy();
  }

  handleSearch(search: string) {
    const VIEWS = lodash.cloneDeep(this.accessGroupsService.retrievePlatformViews());
    if (!lodash.isEmpty(VIEWS)) {
      const FILTERED_VIEWS = VIEWS?.filter(view => {
        const VIEW_INCLUDES_SEARCH = view?.name?.toLowerCase()?.includes(search) || view?.title?.toLowerCase()?.includes(search) || view?.component?.toLowerCase()?.includes(search);
        const ACTIONS_INCLUDE_SEARCH = view?.actions?.filter(action => action?.name?.toLowerCase()?.includes(search) || action?.component?.toLowerCase()?.includes(search));

        if (VIEW_INCLUDES_SEARCH) {
          return view;
        } else if (!lodash.isEmpty(ACTIONS_INCLUDE_SEARCH)) {
          view.actions = ACTIONS_INCLUDE_SEARCH;
          return view;
        }
      });
      this.selection.views = FILTERED_VIEWS;
    }
    _debugX(AccessGroupPolicyPlatformV1.getClassName(), this.handleSearch.name,
      {
        event,
        this_search: event,
        VIEWS,
        this_selection: this.selection
      });
  }

  handleSearchClearEvent(event: any) {
    _debugX(AccessGroupPolicyPlatformV1.getClassName(), this.handleSearchClearEvent.name,
      {
        event,
      });

    this.search = '';
    this.resetSelections();
  }

  handleClearPolicies(event: any): void {
    _debugX(AccessGroupPolicyPlatformV1.getClassName(), this.handleClearPolicies.name,
      {
        event,
      });

    this.resetSelections();
  }

  handleAddPolicies(event: any, all = false): void {
    const ACCESS_GROUP_OLD = lodash.cloneDeep(this.accessGroup);
    const ACCESS_GROUP_NEW = lodash.cloneDeep(this.accessGroup);
    const SELECTION_CLONE = lodash.cloneDeep(this.selection);
    const VIEWS: any[] = all ? SELECTION_CLONE.views : ACCESS_GROUP_OLD?.views || [];
    if (
      !all
    ) {
      SELECTION_CLONE?.views.forEach(view => {
        const EXISTING_VIEW = VIEWS?.find(el => lodash.isEqual(el?.name, view?.name));
        const FILTERED_ACTIONS = view?.actions?.filter(action => action?.checked);

        if (!lodash.isEmpty(EXISTING_VIEW)) {
          const EXISTING_VIEW_ACTIONS = EXISTING_VIEW?.actions || [];
          const UNIQUE_ACTIONS = [...FILTERED_ACTIONS, ...EXISTING_VIEW_ACTIONS].reduce((accumulator, current) => {
            if (lodash.isEmpty(accumulator?.find(el => el?.name === current?.name))) {
              accumulator.push(current);
            }
            return accumulator;
          }, []);
          EXISTING_VIEW.actions = UNIQUE_ACTIONS;
        } else {
          view.actions = FILTERED_ACTIONS;
          if (view.checked || !lodash.isEmpty(FILTERED_ACTIONS)) {
            VIEWS.push(view);
          }
        }
      });
    }
    this._sanitizeViews(VIEWS);
    ACCESS_GROUP_NEW.views = VIEWS;

    this.accessGroupChange.emit(ACCESS_GROUP_NEW);

    _debugX(AccessGroupPolicyPlatformV1.getClassName(), this.handleAddPolicies.name,
      {
        ACCESS_GROUP_OLD,
        ACCESS_GROUP_NEW,
      });

    this.resetSelections();
  }

  private _sanitizeViews(views: any[]) {
    if (
      !lodash.isEmpty(views)
    ) {
      views?.forEach(view => {
        delete view?.checked;

        view?.actions?.forEach((action: any) => {
          delete action?.checked;
        });
      });
    };
    _debugX(AccessGroupPolicyPlatformV1.getClassName(), this._sanitizeViews.name,
      {
        views,
      });
  }

  resetSelections() {
    const VIEWS = this.accessGroupsService.retrievePlatformViews();
    _debugX(AccessGroupPolicyPlatformV1.getClassName(), this.resetSelections.name,
      {
        VIEWS,
      });

    this.selection.views = VIEWS;
    this.policyPlatformCheckboxTree.resetCheckboxes();
  }
}

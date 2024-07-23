/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { JSONPath } from 'jsonpath-plus';

import * as lodash from 'lodash';

import {
  _debugW,
} from 'client-shared-utils';

import {
  BaseFieldWbcV1,
} from 'client-shared-components';

import {
  OrganizationsServiceV1,
} from 'client-services';


@Component({
  selector: 'aiap-wbc-organizations-field-v1',
  templateUrl: './field.html',
  styleUrls: ['./field.scss']
})
export class OrganizationsFieldV1 extends BaseFieldWbcV1 implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'OrganizationsFieldV1';
  }

  @Input() context: any;
  @Output() contextChange = new EventEmitter<any>();

  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  _state: any = {
    appendInline: false,
    disabled: false,
    helperText: 'helper-text',
    invalid: false,
    invalidText: 'invalid-text',
    items: [],
    itemSelected: undefined,
    label: 'label',
    size: 'lg',
    skeleton: false,
    theme: 'light',
    warn: false,
    warnText: 'warn-text',
    search: '',
  }
  state = lodash.cloneDeep(this._state);

  constructor(
    private organizationsService: OrganizationsServiceV1
  ) {
    super();
  }

  ngOnInit(): void {
    _debugW(
      OrganizationsFieldV1.getClassName(),
      'ngOnChanges',
      {
        this_state: this.state,
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    _debugW(
      OrganizationsFieldV1.getClassName(),
      'ngOnChanges',
      {
        changes: changes,
        this_context: this.context,
        this_value: this.value,
        this_state: this.state,
      }
    );
    this.loadOrganizations();
  }

  ngOnDestroy(): void { }

  private loadOrganizations() {
    const STATE = lodash.cloneDeep(this.state);
    STATE.skeleton = true;
    this.state = STATE;
    const QUERY = {
      filter: {},
      sort: {
        field: 'id',
        direction: 'asc'
      },
      pagination: {
        page: 0,
        size: 1000,
      },
    }
    this.organizationsService.findManyByQuery(QUERY).pipe(
      catchError((error) => this.handleFindManyByQueryError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugW(OrganizationsFieldV1.getClassName(), 'loadOrganizations', { response });
      const NEW_STATE = lodash.cloneDeep(this.state);
      const ORGANIZATIONS = response?.items || [];
      NEW_STATE.skeleton = false;
      this.appendOrganizationsAsDropdownItems2Target(NEW_STATE, ORGANIZATIONS);
      this.state = NEW_STATE;
    });
  }

  private appendOrganizationsAsDropdownItems2Target(target: any, organizations: any) {
    target.items = [];
    if (
      !lodash.isEmpty(organizations) &&
      lodash.isArray(organizations)
    ) {
      for (let organization of organizations) {
        const VALUE_ACTUAL = this.retrieveActualValue(organization);
        const IS_SELECTED = lodash.isEqual(
          this.value,
          VALUE_ACTUAL,
        );
        const DROPDOWN_ITEM = {
          content: organization?.name,
          selected: IS_SELECTED,
          value: organization,
        }
        target.items.push(DROPDOWN_ITEM);
        if (
          IS_SELECTED
        ) {
          target.itemSelected = DROPDOWN_ITEM;
        }
      }
    }
  }

  private handleFindManyByQueryError(error: any) {
    const STATE = lodash.cloneDeep(this.state);
    STATE.skeleton = false;
    this.state = STATE;
    return of();
  }

  private retrieveActualValue(value: any) {
    let retVal = value;
    if (
      !lodash.isEmpty(this.context?.wbc?.selector)
    ) {
      retVal = JSONPath({
        wrap: false,
        path: this.context?.wbc?.selector,
        json: value,
      });
    }
    return retVal;
  }

  handleSelected(event: any) {
    const ACTUAL_VALUE = this.retrieveActualValue(event?.item?.value);
    _debugW(OrganizationsFieldV1.getClassName(), 'handleSelected', { event, ACTUAL_VALUE });
    this.valueChange.emit(ACTUAL_VALUE);
  }

  handleSubmit(event: any) {
    _debugW(OrganizationsFieldV1.getClassName(), 'handleSubmit', { event });

  }

  handleSearch(event: any) {
    _debugW(OrganizationsFieldV1.getClassName(), 'handleSearch', { event });

  }


}

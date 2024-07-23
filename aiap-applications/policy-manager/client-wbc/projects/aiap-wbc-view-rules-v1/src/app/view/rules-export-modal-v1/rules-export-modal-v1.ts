/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

import * as lodash from 'lodash';
import * as ramda from 'ramda';
import moment from 'moment';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  BaseModal,
} from 'client-shared-views';

import {
  DEFAULT_TABLE
} from 'client-utils';

import {
  ClientSideDownloadServiceV1,
  OrganizationsServiceV1,
  RulesServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-rules-export-modal-v1',
  templateUrl: './rules-export-modal-v1.html',
  styleUrls: ['./rules-export-modal-v1.scss']
})
export class RulesExportModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'RulesExportModalV1';
  }

  availableBuyers: any = [];
  selectedBuyerIds = [];

  query: any = {
    sort: {
      field: 'name',
      direction: 'asc',
    },
  };

  state: any = {
    query: {
      type: DEFAULT_TABLE.RULES_V1.TYPE,
      sort: DEFAULT_TABLE.RULES_V1.SORT,
    }
  };

  showSpinner = false;

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
    private clientSideDownloadService: ClientSideDownloadServiceV1,
    private organizationsService: OrganizationsServiceV1,
    private rulesService: RulesServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.superNgOnInit(this.eventsService);
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngAfterViewInit(): void { }

  handleBuyerSelect(event: any) {
    this.selectedBuyerIds = event.map(buyer => buyer.id);
  }

  hanldeExportError(error: any) {
    _debugX(RulesExportModalV1.getClassName(), `handleExportError`, { error });

    this.eventsService.loadingEmit(false);
    const NOTIFICATION = {
      type: 'error',
      title: this.translateService.instant('view_rules_v1.export_modal.error_title'),
      message: this.translateService.instant('view_rules_v1.export_modal.error_message'),
      target: '.notification-container',
      duration: 10000
    };
    this.notificationService.showNotification(NOTIFICATION);
    return of({ items: [] });
  }

  export() {
    const PARAMS = {
      ...this.query,
      filter: {
        buyerIds: this.selectedBuyerIds
      }
    };
    _debugX(RulesExportModalV1.getClassName(), `export`, PARAMS);

    this.showSpinner = true;
    this.rulesService.export(PARAMS).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError(error => this.hanldeExportError(error)),
      takeUntil(this._destroyed$)
    ).subscribe((data) => {
      const FILE_NAME = 'rules_export_' + moment().format() + '.xlsx';
      this.clientSideDownloadService.openSaveFileDialog(data, FILE_NAME, undefined);

      const NOTIFICATION = {
        type: 'success',
        title: this.translateService.instant('view_rules_v1.export_modal.success_title'),
        message: this.translateService.instant('view_rules_v1.export_modal.success_message'),
        target: '.notification-container',
        duration: 10000
      };
      this.notificationService.showNotification(NOTIFICATION);
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
      this.close();
    });
  }

  close() {
    this.selectedBuyerIds = [];
    this.isOpen = false;
    this.showSpinner = false;
  }

  show() {
    this.isOpen = true;
    this.organizationsService.findManyByQuery(this.query).pipe(
      catchError(error => this.hanldeExportError(error)),
      takeUntil(this._destroyed$))
      .subscribe((response) => {
        const buyers = ramda.path(['items'], response);
        this.availableBuyers = this._transformBuyersIntoDropDownItems(buyers);
      });
  }

  _transformBuyersIntoDropDownItems(buyers: any) {
    const RET_VAL = [];
    if (
      !lodash.isEmpty(buyers) &&
      lodash.isArray(buyers)
    ) {
      for (let buyer of buyers) {
        let tmpBuyer = this._transformBuyerIntoDropDownItem(buyer);
        if (tmpBuyer) {
          RET_VAL.push(tmpBuyer);
        }
      }
    }
    return RET_VAL;
  }

  _transformBuyerIntoDropDownItem(buyer: any) {
    let retVal;
    if (
      !lodash.isEmpty(buyer?.id) &&
      !lodash.isEmpty(buyer?.name)
    ) {
      const BUYER_NAME = buyer.name;
      const isSelected = false;
      retVal = {
        content: `${BUYER_NAME}`,
        selected: isSelected,
        id: buyer.id,
        name: buyer.name,
      }
    }
    return retVal;
  }
}

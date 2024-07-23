/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugW,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  BaseViewWbcV1,
} from 'client-shared-views';

import {
  DEFAULT_TABLE
} from 'client-utils';

import {
  DocValidationMetricsServiceV1,
  OrganizationsServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-wbc-doc-validation-metrics-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class DocValidationMetricsViewV1 extends BaseViewWbcV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'DocValidationMetricsViewV1';
  }

  _state: any = {
    dateRange: {},
    organizations: [],
    organizationsSelected: [],
    query: {
      type: DEFAULT_TABLE.DOC_VALIDATIONS_METRICS_V1.TYPE,
      sort: undefined,
    }
  };
  state = lodash.cloneDeep(this._state);

  response: any = {
    totalReceivedValidations: 0,
    totalCompletedValidations: 0,
    totalApprovedValidations: 0,
    totalRejectedValidations: 0,
    totalFailedValidations: 0,
    totalValidatedPRs: 0,
    totalApprovedPRs: 0,
    totalRejectPRs: 0,
    uniqueBuyers: 0
  }

  showData = false;

  constructor(
    // params-super
    protected notificationService: NotificationService,
    // params-external
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
    // params-native
    private docValidationMetricsService: DocValidationMetricsServiceV1,
    private organizationsService: OrganizationsServiceV1,
  ) {
    super(notificationService);
  }

  ngOnInit(): void {
    this._refreshOrganizationsDropdownList();
    const QUERY = this.queryService.query(this.state?.query?.type);
    this.state.dateRange = QUERY?.filter?.dateRange;
    _debugW(DocValidationMetricsViewV1.getClassName(), `ngOnInit`,
      {
        query: QUERY,
        this_state: this.state
      });

    this.queryService.refreshState(this.state?.query?.type);
    this.addFilterEventHandler();
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngAfterViewInit(): void {
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  _refreshOrganizationsDropdownList() {
    this.state.organizationsSelected = [];
    this.organizationsService.findManyByQuery({
      sort: {
        field: 'id',
        direction: 'asc'
      }
    }).pipe(
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      const ORGANIZATIONS: any = ramda.path(['items'], response);
      this.state.organizations = ORGANIZATIONS.map((organization: any) => {
        const RET_VAL = {
          content: `${organization.name}`,
          selected: false,
          ...organization
        };
        return RET_VAL;
      });
      _debugW(DocValidationMetricsViewV1.getClassName(), `_refreshOrganizationsDropdownList`,
        {
          response
        }
      );
    });
  }

  addFilterEventHandler() {
    this.eventsService.filterEmitter.pipe(
      switchMap((query: any) => {
        _debugW(DocValidationMetricsViewV1.getClassName(), `addFilterEventHandler`,
          {
            query
          });

        const RET_VAL = this.docValidationMetricsService.retriveMetrics(query)
          .pipe(
            catchError(() => this.handleMetricsError())
          );
        return RET_VAL;
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      _debugW(DocValidationMetricsViewV1.getClassName(), 'addFilterEventHandler',
        {
          response
        });

      this.response = response;
      this.showData = true;
    });
  }

  handleRefreshClick() {
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
    this.handleDateRangeChange(this.state?.dateRange);
  }

  _selectedOrganizationsIds() {
    const RET_VAL = [];
    if (
      lodash.isArray(this.state?.organizationsSelected) &&
      !lodash.isEmpty(this.state?.organizationsSelected)
    ) {
      for (let organization of this.state?.organizationsSelected) {
        if (
          !lodash.isEmpty(organization) &&
          organization.selected
        ) {
          RET_VAL.push(organization.id);
        }
      }
    }
    return RET_VAL;
  }

  handleOrganizationSelectionEvent(event) {
    _debugW(DocValidationMetricsViewV1.getClassName(), 'handleOrganizationSelectionEvent', {
      event: event,
      this_state: this.state
    });

    this.queryService.setFilterItem(
      this.state?.query?.type,
      QueryServiceV1.FILTER_KEY.ORGANIZATION_IDS,
      this._selectedOrganizationsIds()
    );

    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleDateRangeChange(range: any) {
    this.showData = false;
    _debugW(DocValidationMetricsViewV1.getClassName(), `handleDateRangeChange`,
      {
        range
      });

    this.queryService.setFilterItem(
      this.state?.query?.type,
      QueryServiceV1.FILTER_KEY.DATE_RANGE,
      range
    );

    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleMetricsError(): Observable<any> {
    const RET_VAL = of({
      total: 'N/A',
      totalValidated: 'N/A',
      approved: 'N/A',
      totalApproved: 'N/A',
      rejected: 'N/A',
      pRSentToAssistance: 'N/A',
      uniqueBuyers: 'N/A',
    });
    return RET_VAL;
  }

}

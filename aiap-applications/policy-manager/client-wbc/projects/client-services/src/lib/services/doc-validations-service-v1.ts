/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, forkJoin, map, of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';
import { OrganizationsServiceV1 } from './organizations-service-v1';

const FILTER_OPTIONS_DOC_VALIDATION_ACTIONS =
  [
    {
      content: 'ALL',
      value: undefined,
    },
    {
      content: 'REQUEST_RECEIVED',
      value: 'REQUEST_RECEIVED',
    },
    {
      content: 'REQUEST_TRANSFORMED',
      value: 'REQUEST_TRANSFORMED',
    },
    {
      content: 'RESPONSE_READY',
      value: 'RESPONSE_READY',
    },
    {
      content: 'RESPONSE_TRANSFORMED',
      value: 'RESPONSE_TRANSFORMED',
    },
  ];

const FILTER_OPTIONS_RULE_TYPES =
  [
    {
      content: 'ALL',
      value: undefined,
    },
    {
      content: 'BUY_RULES',
      value: 'BUY_RULES',
    },
    {
      content: 'CATALOG_RULES',
      value: 'CATALOG_RULES',
    },
    {
      content: 'CLASSIFICATION_RULES',
      value: 'CLASSIFICATION_RULES',
    },
  ];

const FILTER_OPTIONS_DOCUMENT_TYPES =
  [
    {
      content: 'ALL',
      value: undefined,
    },
    {
      content: 'PURCHASE_REQUEST',
      value: 'PURCHASE_REQUEST',
    },
  ];


@Injectable()
export class DocValidationsServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'DocValidationsServiceV1';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private httpClient: HttpClient,
    private organizationsService: OrganizationsServiceV1,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/doc-validation-audits`;
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = {
      ...query
    };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(DocValidationsServiceV1.getClassName(), 'findManyByQuery',
      {
        REQUEST_URL,
        REQUEST,
      });

    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  exportMany(query: any) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);

    const REQUEST_URL = `${this._hostAndBasePath()}/export-many?` //
      + `size=${PAGINATION_SIZE}&`
      + `page=${PAGINATION_PAGE}&`
      + `field=${SORT_FIELD}&`
      + `sort=${SORT_DIRECTION}&`;

    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(DocValidationsServiceV1.getClassName(), 'exportMany',
      {
        REQUEST_URL,
        REQUEST_HEADERS,
      });

    return this.httpClient.post(REQUEST_URL, null, {
      ...REQUEST_HEADERS,
      responseType: 'blob'
    });
  }

  report(query: any) {
    const PAGINATION_PAGE = 1;
    const PAGINATION_SIZE = 9999;
    const SORT_FIELD = ramda.path(['sort', 'field'], query);
    const SORT_DIRECTION = ramda.path(['sort', 'direction'], query);

    const REQUEST_URL = `${this._hostAndBasePath()}/report?` //
      + `size=${PAGINATION_SIZE}&`
      + `page=${PAGINATION_PAGE}&`
      + `field=${SORT_FIELD}&`
      + `sort=${SORT_DIRECTION}&`;

    const REQUEST_HEADERS = this.getAuthHeaders();
    const REQUEST_BODY = query;
    _debugX(DocValidationsServiceV1.getClassName(), 'report',
      {
        REQUEST_URL,
        REQUEST_HEADERS,
        REQUEST_BODY,
      });

    return this.httpClient.post(REQUEST_URL, REQUEST_BODY, {
      ...REQUEST_HEADERS,
      responseType: 'blob'
    });
  }

  loadFilterOptions() {
    const FORK_JOIN: any = {};

    FORK_JOIN.actions = of(FILTER_OPTIONS_DOC_VALIDATION_ACTIONS);
    FORK_JOIN.docTypes = of(FILTER_OPTIONS_DOCUMENT_TYPES);
    FORK_JOIN.ruleTypes = of(FILTER_OPTIONS_RULE_TYPES);

    const ORG_QUERY = {
      pagination: {
        page: 1,
        size: 99999
      },
    };

    FORK_JOIN.organizations = this.organizationsService.findManyLiteByQuery(ORG_QUERY)
      .pipe(
        map(this._transformOrganizationResponseToDropdownSelection.bind(this)),
      );

    return forkJoin(FORK_JOIN);
  };


  findFilterOptions(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-filter-options`;
    const REQUEST = {
      ...query
    };
    const REQUEST_HEADERS = this.getAuthHeaders();
    _debugX(DocValidationsServiceV1.getClassName(), 'findFilterOptions',
      {
        REQUEST_URL,
        REQUEST,
      });

    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_HEADERS);
  }

  _transformOrganizationResponseToDropdownSelection(response) {
    const RET_VAL = [];

    RET_VAL.push({
      content: 'ALL',
      value: '',
    });

    RET_VAL.push(...response?.items?.map(this._transformOrganizationToDropdownSelection));

    return RET_VAL;
  }

  _transformOrganizationToDropdownSelection(organization) {
    const RET_VAL = {
      content: organization?.name,
      value: organization?.id,
    };
    return RET_VAL;
  }
}

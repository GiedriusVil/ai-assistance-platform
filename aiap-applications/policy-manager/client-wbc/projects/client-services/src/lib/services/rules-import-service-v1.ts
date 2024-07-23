/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { forkJoin, of } from 'rxjs';

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

import { OrganizationsServiceV1 } from './organizations-service-v1';
import { RuleMessagesServiceV1 } from './rule-messages-service-v1';

@Injectable()
export class RulesImportServiceV1 extends BaseServiceV1 {

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private httpClient: HttpClient,
    private organizationsService: OrganizationsServiceV1,
    private ruleMessagesService: RuleMessagesServiceV1,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    let retVal = `${this._hostUrl()}/api/import/rules/`;
    return retVal;
  }

  retrieveRuleConditionsTableData() {
    const RULE_CONDITION_FACTS = {
      HEADER: [
        {
          content: "extId"
        },
        {
          content: "tenant",
          paths: [
            {
              content: "$.id"
            }, {
              content: "$.extId"
            }, {
              content: "$.name"
            }, {
              content: "$.country"
            }
          ]
        },
        {
          content: "client",
          paths: [
            {
              content: "$.id"
            }, {
              content: "$.extId"
            }, {
              content: "$.name"
            }, {
              content: "$.address.city"
            }, {
              content: "$.address.country"
            }, {
              content: "$.address.house"
            }, {
              content: "$.address.street"
            }, {
              content: "$.address.zip"
            }
          ]
        },
        {
          content: "delivery",
          paths: [
            {
              content: "$.address.city"
            }, {
              content: "$.address.country"
            }, {
              content: "$.address.house"
            }, {
              content: "$.address.street"
            }, {
              content: "$.address.zip"
            }
          ]
        },
        {
          content: "totals",
          paths: [
            {
              content: "$.extension.currency"
            }, {
              content: "$.extension.value"
            }, {
              content: "$.exclusiveTax.currency"
            }, {
              content: "$.exclusiveTax.value"
            }, {
              content: "$.inclusiveTax.currency"
            }, {
              content: "$.inclusiveTax.value"
            }, {
              content: "$.payable.currency"
            }, {
              content: "$.payable.value"
            }
          ]
        }
      ],
      GROUP: [
        {
          content: "group",
          paths: [
            {
              content: "$.id"
            },
            {
              content: "$.ids"
            },
            {
              content: "$.totalAmount"
            },
            {
              content: "$.totalQuantity"
            },
            {
              content: "$.isSellerAuthorized"
            },
            {
              content: "$.category"
            }
          ]
        }
      ],
      ITEM: [
        {
          content: "item",
          paths: [
            {
              content: "$.id"
            }, {
              content: "$.extId"
            }, {
              content: "$.extension.currency"
            }, {
              content: "$.extension.value"
            }, {
              content: "$.price.base.unit"
            }, {
              content: "$.price.base.value"
            }, {
              content: "$.price.money.currency"
            }, {
              content: "$.price.money.value"
            }, {
              content: "$.quantity.unit"
            }, {
              content: "$.quantity.value"
            }, {
              content: "$.seller.id"
            }, {
              content: "$.seller.extId"
            }, {
              content: "$.seller.name"
            }, {
              content: "$.sellerEntity"
            }, {
              content: "$.status"
            }, {
              content: "$.tax.currency"
            }, {
              content: "$.tax.value"
            }, {
              content: "$.isSellerAuthorized"
            }, {
              content: "$.isFSI"
            }, {
              content: "$.category"
            }
          ]
        }
      ]
    }
    const RULE_CONDITION_OPERATORS = [
      { content: 'equal', ruleTypes: ['HEADER', 'ITEM', 'GROUP'], facts: ['any'], paths: ['any'] },
      { content: 'notEqual', ruleTypes: ['HEADER', 'ITEM', 'GROUP'], facts: ['any'], paths: ['any'] },
      { content: 'lessThan', ruleTypes: ['HEADER', 'ITEM', 'GROUP'], facts: ['any'], paths: ['any'] },
      { content: 'lessThanInclusive', ruleTypes: ['HEADER', 'ITEM', 'GROUP'], facts: ['any'], paths: ['any'] },
      { content: 'greaterThan', ruleTypes: ['HEADER', 'ITEM', 'GROUP'], facts: ['any'], paths: ['any'] },
      { content: 'greaterThanInclusive', ruleTypes: ['HEADER', 'ITEM', 'GROUP'], facts: ['any'], paths: ['any'] },
      { content: 'in', ruleTypes: ['HEADER', 'ITEM', 'GROUP'], facts: ['any'], paths: ['any'] },
      { content: 'notIn', ruleTypes: ['HEADER', 'ITEM', 'GROUP'], facts: ['any'], paths: ['any'] },
      { content: 'contains', ruleTypes: ['HEADER', 'ITEM', 'GROUP'], facts: ['any'], paths: ['any'] },
      { content: 'doesNotContain', ruleTypes: ['HEADER', 'ITEM', 'GROUP'], facts: ['any'], paths: ['any'] },
      { content: 'totalItemAmountExceeds', ruleTypes: ['ITEM'], facts: ['item'], paths: [null] },
      { content: 'totalItemAmountLessThan', ruleTypes: ['ITEM'], facts: ['item'], paths: [null] },
      { content: 'isEmpty', ruleTypes: ['HEADER', 'ITEM', 'GROUP'], facts: ['any'], paths: [null] },
      { content: 'allItemsAreFSI', ruleTypes: ['HEADER'], facts: ['items'], paths: [null] }
    ]

    const RET_VAL = forkJoin(
      {
        ruleConditionFacts: of(RULE_CONDITION_FACTS),
        ruleConditionOperators: of(RULE_CONDITION_OPERATORS)
      }
    );
    return RET_VAL;
  }

  retrieveRuleSaveFormData(rule: any) {
    const RULE_TYPES = [
      {
        content: 'HEADER',
        code: 'HEADER'
      },
      {
        content: 'ITEM',
        code: 'ITEM'
      },
      {
        content: 'GROUP',
        code: 'GROUP'
      }
    ];

    const ACTION_TYPES = [
      {
        content: 'PA',
        code: 'PA',
      },
      {
        content: 'RESELLER',
        code: 'RESELLER'
      },
      {
        content: 'CLIENT BUY DESK',
        code: 'CLIENT BUY DESK'
      },
      {
        content: 'PA/BD',
        code: 'PA/BD'
      },
      {
        content: 'SINGLE-PAYER',
        code: 'SINGLE-PAYER'
      },
      {
        content: 'P2P AUTO',
        code: 'P2P AUTO'
      },
      {
        content: 'End-User RFQ',
        code: 'End-User RFQ'
      }
    ];

    const QUERY_ORGANIZATIONS = {
      sort: {
        field: 'name',
        direction: 'asc'
      },
      pagination: {
        page: 1,
        size: 1000,
      }
    };

    const QUERY_RULES_MESSAGES = {
      sort: {
        field: 'name',
        direction: 'asc'
      },
      pagination: {
        page: 1,
        size: 1000,
      }
    };

    const RET_VAL = forkJoin(
      {
        types: of(RULE_TYPES),
        actions: of(ACTION_TYPES),
        buyers: this.organizationsService.findManyByQuery(QUERY_ORGANIZATIONS),
        messages: this.ruleMessagesService.findManyByQuery(QUERY_RULES_MESSAGES),
      }
    );
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}find-many-by-query`;
    const REQUEST = {
      ...query
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  saveOne(rule: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}save-one`;
    const REQUEST = {
      rule
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  deleteOneById(id: string) {
    const REQUEST_URL = `${this._hostAndBasePath()}delete-one-by-id`;
    const REQUEST = {
      id: id,
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  deleteManyByIds(ids: any[]) {
    const REQUEST_URL = `${this._hostAndBasePath()}delete-many-by-ids`;
    return this.httpClient.post(REQUEST_URL, ids, this.getAuthHeaders());
  }

  uploadFile(file: File) {
    const REQUEST_URL = `${this._hostAndBasePath()}upload`;
    const formData: FormData = new FormData();
    formData.append('rulesFile', file, file.name);
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, formData, REQUEST_OPTIONS);
  }

  submitImport() {
    const REQUEST_URL = `${this._hostAndBasePath()}submit`;
    const REQUEST = {};
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  clearImport() {
    const REQUEST_URL = `${this._hostAndBasePath()}clear-import`;
    const REQUEST = {};
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  enableManyByIds (ids: any[]) {
    const REQUEST_URL = `${this._hostAndBasePath()}enable-many-by-ids`;
    const REQUEST = {
      value : {
        ids,
      }
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }
}

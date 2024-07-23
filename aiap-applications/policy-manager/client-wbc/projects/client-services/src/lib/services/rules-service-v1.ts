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
export class RulesServiceV1 extends BaseServiceV1 {

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
    let retVal = `${this._hostUrl()}/api/rules`;
    return retVal;
  }

  retrieveRuleConditionsTableData() {
    const GROUP_PATHS = [
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
    ];
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
          content: "id",
          paths: GROUP_PATHS
        }, {
          content: "extId",
          paths: GROUP_PATHS
        }, {
          content: "uuid",
          paths: GROUP_PATHS
        }, {
          content: "extension_currency",
          paths: GROUP_PATHS
        }, {
          content: "extension_value",
          paths: GROUP_PATHS
        }, {
          content: "price_base_unit",
          paths: GROUP_PATHS
        }, {
          content: "price_base_value",
          paths: GROUP_PATHS
        }, {
          content: "price_money_currency",
          paths: GROUP_PATHS
        }, {
          content: "price_money_value",
          paths: GROUP_PATHS
        }, {
          content: "quantity_unit",
          paths: GROUP_PATHS
        }, {
          content: "seller_id",
          paths: GROUP_PATHS
        }, {
          content: "seller_extId",
          paths: GROUP_PATHS
        }, {
          content: "seller_name",
          paths: GROUP_PATHS
        }, {
          content: "seller_address_city",
          paths: GROUP_PATHS
        }, {
          content: "seller_address_country",
          paths: GROUP_PATHS
        }, {
          content: "seller_address_house",
          paths: GROUP_PATHS
        }, {
          content: "seller_address_street",
          paths: GROUP_PATHS
        }, {
          content: "seller_address_zip",
          paths: GROUP_PATHS
        }, {
          content: "sellerEntity",
          paths: GROUP_PATHS
        }, {
          content: "status",
          paths: GROUP_PATHS
        }, {
          content: "tax_currency",
          paths: GROUP_PATHS
        }, {
          content: "tax_value",
          paths: GROUP_PATHS
        }, {
          content: "isFSI",
          paths: GROUP_PATHS
        }, {
          content: "isSellerAuthorized",
          paths: GROUP_PATHS
        }, {
          content: "category",
          paths: GROUP_PATHS
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
            }, {
              content: "$.purchaseType"
            }
          ]
        }
      ]
    }
    const RULE_CONDITION_OPERATORS = [
      { content: 'equal', ruleTypes: ['HEADER', 'ITEM', 'GROUP'], facts: ['any'], paths: ['any'], operatorValueType: this.operatorValueType.STRING },
      { content: 'notEqual', ruleTypes: ['HEADER', 'ITEM', 'GROUP'], facts: ['any'], paths: ['any'], operatorValueType: this.operatorValueType.STRING },
      { content: 'lessThan', ruleTypes: ['HEADER', 'ITEM', 'GROUP'], facts: ['any'], paths: ['any'], operatorValueType: this.operatorValueType.STRING },
      { content: 'lessThanInclusive', ruleTypes: ['HEADER', 'ITEM', 'GROUP'], facts: ['any'], paths: ['any'], operatorValueType: this.operatorValueType.STRING },
      { content: 'greaterThan', ruleTypes: ['HEADER', 'ITEM', 'GROUP'], facts: ['any'], paths: ['any'], operatorValueType: this.operatorValueType.STRING },
      { content: 'greaterThanInclusive', ruleTypes: ['HEADER', 'ITEM', 'GROUP'], facts: ['any'], paths: ['any'], operatorValueType: this.operatorValueType.STRING },
      { content: 'in', ruleTypes: ['HEADER', 'ITEM', 'GROUP'], facts: ['any'], paths: ['any'], operatorValueType: this.operatorValueType.ARRAY },
      { content: 'notIn', ruleTypes: ['HEADER', 'ITEM', 'GROUP'], facts: ['any'], paths: ['any'], operatorValueType: this.operatorValueType.ARRAY },
      { content: 'contains', ruleTypes: ['HEADER', 'ITEM', 'GROUP'], facts: ['any'], paths: ['any'], operatorValueType: this.operatorValueType.STRING },
      { content: 'doesNotContain', ruleTypes: ['HEADER', 'ITEM', 'GROUP'], facts: ['any'], paths: ['any'], operatorValueType: this.operatorValueType.STRING },
      { content: 'totalItemAmountExceeds', ruleTypes: ['ITEM'], facts: ['item'], paths: [null], operatorValueType: this.operatorValueType.STRING },
      { content: 'totalItemAmountLessThan', ruleTypes: ['ITEM'], facts: ['item'], paths: [null], operatorValueType: this.operatorValueType.STRING },
      { content: 'isEmpty', ruleTypes: ['HEADER', 'ITEM', 'GROUP'], facts: ['any'], paths: [null], operatorValueType: this.operatorValueType.NONE },
      { content: 'allItemsAreFSI', ruleTypes: ['HEADER'], facts: ['items'], paths: [null], operatorValueType: this.operatorValueType.STRING }
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
    const QUERY = {
      sort: {
        field: 'name',
        direction: 'asc'
      },
      pagination: {
        page: 1,
        size: 1000,
      }
    };

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

    const RET_VAL = forkJoin(
      {
        types: of(RULE_TYPES),
        actions: of(ACTION_TYPES),
        buyers: this.organizationsService.findManyByQuery(QUERY),
        messages: this.ruleMessagesService.findManyByQuery(QUERY),
      }
    );
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = {
      ...query
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  saveOne(rule: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    const REQUEST = { rule };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  findOneById(id: string) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-one-by-id`;
    const REQUEST = {
      id: id,
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  deleteOneById(id: string) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-one-by-id`;
    const REQUEST = {
      id: id,
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  deleteManyByIds(ids: any[]) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    return this.httpClient.post(REQUEST_URL, ids, this.getAuthHeaders());
  }

  pull() {
    const REQUEST_URL = `${this._hostAndBasePath()}/pull`;
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, {}, REQUEST_OPTIONS);
  }

  export(params) {
    const REQUEST_URL = `${this._hostAndBasePath()}/export`;
    return this.httpClient.post(REQUEST_URL, params, {
      headers: {
        ['Authorization']: `Bearer ${this._token()}`,
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      },
      responseType: "blob",
    });
  }

  enableManyByIds(ids: any[]) {
    const REQUEST_URL = `${this._hostAndBasePath()}/enable-many-by-ids`;
    const REQUEST = {
      value : {
        ids: ids,
      }
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  get operatorValueType() {
    const RET_VAL = {
      NONE: "none",
      STRING: "string",
      ARRAY: "array"
    };
    return RET_VAL;
  }
}

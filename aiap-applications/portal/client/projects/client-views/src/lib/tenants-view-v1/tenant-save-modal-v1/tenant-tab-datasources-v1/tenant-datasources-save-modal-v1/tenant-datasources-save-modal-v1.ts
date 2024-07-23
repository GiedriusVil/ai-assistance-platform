/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';

import { Subject } from 'rxjs/internal/Subject';

import * as lodash from 'lodash';

import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';

import {
  _debugX,
  ensureIdExistance,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-tenant-datasources-save-modal-v1',
  templateUrl: './tenant-datasources-save-modal-v1.html',
  styleUrls: ['./tenant-datasources-save-modal-v1.scss'],
})
export class TenantDatasourcesSaveModalV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'TenantDatasourcesSaveModalV1';
  }

  private _destroyed$: Subject<void> = new Subject();

  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;
  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  isOpen = false;

  @Input() datasources: Array<any>;

  @Output() onAddDatasource = new EventEmitter<any>();

  _selections: any = {
    datasourceTypes: [
      {
        content: 'AI Services',
        value: 'aiServices',
      },
      {
        content: 'Action Items',
        value: 'actionItems',
      },
      {
        content: 'Analytics Live',
        value: 'analyticsLive'
      },
      {
        content: 'Announcements',
        value: 'announcements',
      },
      {
        content: 'Answers',
        value: 'answers'
      },
      {
        content: 'Auditor',
        value: 'auditor'
      },
      {
        content: 'Audio Voice Services',
        value: 'audioVoiceServices'
      },
      {
        content: 'Buy rules',
        value: 'buyRules'
      },
      {
        content: 'Catalog rules',
        value: 'catalogRules'
      },
      {
        content: 'Classifier',
        value: 'classifier'
      },
      {
        content: 'Classification catalogs',
        value: 'classificationCatalogs',
      },
      {
        content: 'Classification rules',
        value: 'classificationRules'
      },
      {
        content: 'Coach',
        value: 'coach',
      },
      {
        content: 'Comments',
        value: 'comments',
      },
      {
        content: 'Conversations',
        value: 'conversations',
      },
      {
        content: 'Data Masking',
        value: 'dataMasking'
      },
      {
        content: 'Document validation',
        value: 'docValidation'
      },
      {
        content: 'ETL Templates',
        value: 'etlTemplates',
      },
      {
        content: 'Engagements',
        value: 'engagements',
      },
      {
        content: 'Jobs Queues',
        value: 'jobsQueues',
      },
      {
        content: 'Lambda Modules',
        value: 'lambdaModules'
      },
      {
        content: 'Live Analytics',
        value: 'liveAnalytics'
      },
      {
        content: 'Metrics',
        value: 'metrics',
      },
      {
        content: 'Oauth2',
        value: 'oauth2',
      },
      {
        content: 'Object Storage',
        value: 'objectStorage',
      },
      {
        content: 'Organizations',
        value: 'organizations',
      },
      {
        content: 'Rule Actions',
        value: 'ruleActions'
      },
      {
        content: 'Rules',
        value: 'rules'
      },
      {
        content: 'Test Cases',
        value: 'testCases'
      },
      {
        content: 'Topic Modeling',
        value: 'topicModeling'
      },
      {
        content: 'AI Translation Services',
        value: 'aiTranslationServices'
      },
      {
        content: 'AI Search and Analysis Services',
        value: 'aiSeachAndAnalysisServices'
      },
      {
        content: 'Validation Engagements',
        value: 'validationEngagements'
      },
      {
        content: 'Rules V2',
        value: 'rulesV2'
      },
      {
        content: 'Conversations Shadow',
        value: 'convShadow'
      },
    ],
    datasourceType: undefined,
    dbClients: [],
    dbClient: undefined,
  }

  _datasource = {
    type: undefined,
    client: undefined,
    collections: undefined,
  };

  datasource = lodash.cloneDeep(this._datasource);
  selections = lodash.cloneDeep(this._selections);

  constructor() {
    //
  }

  ngOnInit() {
    this.jsonEditorOptions.name = 'Configuration';
    this.jsonEditorOptions.statusBar = true;
    this.jsonEditorOptions.mode = 'code';
    this.jsonEditorOptions.modes = ['code', 'text', 'tree', 'view'];
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  show(datasource: any, clients: Array<any>) {
    _debugX(TenantDatasourcesSaveModalV1.getClassName(), 'show',
      {
        this_datasources: this.datasources,
        datasource: datasource,
        clients: clients,
      });

    this.selections = lodash.cloneDeep(this._selections);
    const ID = datasource?.id;
    if (
      lodash.isEmpty(ID)
    ) {
      this.datasource = lodash.cloneDeep(this._datasource);
    } else {
      this.datasource = lodash.cloneDeep(datasource);
    }
    this.setClientSelections(clients);
    this.setDatasourceTypeSeletions();
    this.isOpen = true;
  }

  save() {
    const DATASOURCE = this.getSanitizedDatasource();
    ensureIdExistance(DATASOURCE);
    _debugX(TenantDatasourcesSaveModalV1.getClassName(), 'save',
      {
        DATASOURCE,
      });

    this.onAddDatasource.emit(DATASOURCE);
    this.close();
  }

  close() {
    this.isOpen = false;
  }

  private getSanitizedDatasource() {
    const RET_VAL = lodash.cloneDeep(this.datasource);
    RET_VAL.client = this.selections?.dbClient?.value;
    RET_VAL.type = this.selections?.datasourceType?.value;
    RET_VAL.collections = this.jsonEditor.get();
    return RET_VAL;
  }

  private setClientSelections(clients: any) {
    this.selections.dbClients = this.transformClientsIntoToDropdownItems(clients);
    const DB_CLIENT_SELECTED = this.datasource?.client;
    for (const DB_CLIENT of this.selections.dbClients) {
      if (
        DB_CLIENT_SELECTED === DB_CLIENT?.value
      ) {
        DB_CLIENT.selected = true;
        this.selections.dbClient = DB_CLIENT;
        break;
      }
    }
  }

  private setDatasourceTypeSeletions() {
    const TYPE_SELECTED = this.datasource?.type;
    for (const DATASOURCE_TYPE of this.selections.datasourceTypes) {
      if (
        TYPE_SELECTED === DATASOURCE_TYPE?.value
      ) {
        DATASOURCE_TYPE.selected = true;
        this.selections.datasourceType = DATASOURCE_TYPE;
        break;
      }
    }
  }

  private transformClientsIntoToDropdownItems(items: Array<any>) {
    const RET_VAL = [];
    if (items && items.length > 0) {
      for (const ITEM of items) {
        const TMP_OPTION = this.transformClientIntoDropdownItem(ITEM);
        if (
          TMP_OPTION
        ) {
          RET_VAL.push(TMP_OPTION);
        }
      }
    }
    return RET_VAL;
  }

  private transformClientIntoDropdownItem(item: any) {
    let retVal;
    if (
      lodash.isString(item?.name) &&
      !lodash.isEmpty(item?.name) &&
      lodash.isString(item?.id) &&
      !lodash.isEmpty(item?.id)
    ) {
      retVal = {
        content: item.name,
        value: item.id,
      }
    }
    return retVal;
  }

  isDatasourceConfigured(item: any) {
    let retVal = false;
    for (const DATASOURCE of this.datasources) {
      if (
        item?.value &&
        DATASOURCE?.type &&
        item?.value === DATASOURCE?.type
      ) {
        retVal = true;
        break;
      }
    }
    return retVal;
  }

}

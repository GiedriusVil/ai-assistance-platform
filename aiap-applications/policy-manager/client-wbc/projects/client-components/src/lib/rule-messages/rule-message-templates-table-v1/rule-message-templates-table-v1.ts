/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, OnChanges, AfterViewInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs/internal/Subject';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  TableModel,
  TableHeaderItem,
  TableItem,
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  RuleMessagesServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-rule-message-templates-table-v1',
  templateUrl: './rule-message-templates-table-v1.html',
  styleUrls: ['./rule-message-templates-table-v1.scss']
})
export class RuleMessageTemplatesTableV1 implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  static getClassName() {
    return 'RuleMessageTemplatesTableV1';
  }

  private _destroyed$: Subject<void> = new Subject();
  isOpen = false;

  @Input() message: any;

  @ViewChild('actionsOverFlowTemplate', { static: true }) actionsOverFlowTemplate: TemplateRef<any>;
  @ViewChild('templateMessageTemplate', { static: true }) templateMessageTemplate: TemplateRef<any>;
  @ViewChild('templateLanguageTemplate', { static: true }) templateLanguageTemplate: TemplateRef<any>;

  templateModel: TableModel = new TableModel();
  _template = {
    index: undefined,
    language: undefined,
    message: undefined
  }

  selections: any = {
    templates: {}
  }
  languages: any[];

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationService,
    private ruleMessagesServiceV1: RuleMessagesServiceV1,
    private translateService: TranslateHelperServiceV1,
  ) { }

  ngOnInit() {
    this.constructTableHeader();
    this.ruleMessagesServiceV1.retrieveMessageSaveFormData()
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleRetrieveMessageMessageTemplatesTableDataError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(RuleMessageTemplatesTableV1.getClassName(), 'ngOnInit', { response })
        this.languages = response?.languages;
        this.eventsService.loadingEmit(false);
        this.refreshTable();
      });
  }

  ngOnChanges() {
    this.refreshTable();
  }

  ngOnDestroy() { }

  ngAfterViewInit() { }

  handleRetrieveMessageMessageTemplatesTableDataError(error: any) {
    this.eventsService.loadingEmit(false);
    let message;
    if (error instanceof HttpErrorResponse) {
      message = `[${error.status} - ${error.statusText}] ${error.message} - ${JSON.stringify(error.error)}`;
    } else {
      message = `${JSON.stringify(error)}`;
    }
    const NOTIFICATION = {
      type: "error",
      title: this.translateService.instant('rule_messages.templates_table_v1.notification.error.title'),
      message: message,
      target: ".notification-container",
      duration: 10000
    }
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  constructTableHeader() {
    const TABLE_HEADER = [];
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('rule_messages.templates_table_v1.message_header'),
      field: 'message',
      style: { width: '70%' }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('rule_messages.templates_table_v1.language_header'),
      field: 'language',
      style: { width: '20%' }
    }));
    TABLE_HEADER.push(new TableHeaderItem({
      data: this.translateService.instant('rule_messages.templates_table_v1.action_header'),
      style: { width: '10%' }
    }));
    this.templateModel.header = TABLE_HEADER;
  }

  setLanguages(template: any) {
    let languages = lodash.cloneDeep(this.languages);
    if (
      lodash.isEmpty(template)
    ) {
      languages = this.languages;
    } else if (
      !lodash.isEmpty(languages)
    ) {
      for (let language of languages) {
        if (language.code == template.language) {
          language.selected = true;
        } else {
          language.selected = false;
        }
      }
    }
    return languages;
  }

  refreshTable() {
    this._refreshTemplateIndexes();
    const TABLE_ROWS = [];
    if (
      !lodash.isEmpty(this.message.templates) &&
      lodash.isArray(this.message.templates)
    ) {
      const MESSAGE_TEMPLATES = lodash.cloneDeep(this.message.templates);
      MESSAGE_TEMPLATES.forEach((template, index) => {
        TABLE_ROWS.push(this.transformTemplateToRow(template));

        const LANGUAGES = this.setLanguages(template);
        this.selections.templates[index] = {
          template: template,
          languages: LANGUAGES
        };

        _debugX(RuleMessageTemplatesTableV1.getClassName(), 'refreshTable',
          {
            index,
            this_message_template: template,
            this_selections: this.selections
          });

      });
    }
    this.templateModel.data = TABLE_ROWS;
  }

  isTemplateDefault(template) {
    const DEFAULT_LANGUAGE = 'en-gb';
    return template?.language === DEFAULT_LANGUAGE && template?.index === 0;
  }

  transformTemplateToRow(template) {
    const RET_VAL = [];
    template.isDefault = this.isTemplateDefault(template);
    RET_VAL.push(new TableItem({ data: template, template: this.templateMessageTemplate }));
    RET_VAL.push(new TableItem({ data: template, template: this.templateLanguageTemplate }));
    RET_VAL.push(new TableItem({ data: template, template: this.actionsOverFlowTemplate }));
    return RET_VAL;
  }

  _getTemplateArrayIndex(index: any) {
    return this.message.templates.findIndex((el) => el.index == index);
  };

  addTemplate() {
    const template = lodash.cloneDeep(this._template);
    template.index = this.message.templates.length;

    this._addTemplateToTableModel(template);
    this._addTemplate(template);
    this.refreshTable();
  }

  removeTemplate(template: any, event: any) {
    const index = ramda.path(['index'], template);

    this._removeTemplateFromTableModel(index);
    this._removeTemplateFromMessageTemplates(index);
    this.refreshTable();
  }

  handleLanguagesSelect(event: any, template: any) {
    _debugX(RuleMessageTemplatesTableV1.getClassName(), 'handleLanguagesSelect',
      {
        template,
        event,
        this_message_templates: this.message.templates
      });

    const index = template.index;
    const TEMPLATE_LANGUAGE = ramda.path(['item', 'code'], event);

    for (let template of this.message.templates) {
      if (
        template.index == index
      ) {
        template.language = TEMPLATE_LANGUAGE;
      };
    };
  }

  _removeTemplateFromTableModel(index: any) {
    const arrayIndex = this._getTemplateArrayIndex(index);
    _debugX(RuleMessageTemplatesTableV1.getClassName(), '_removeTemplateFromTableModel',
      {
        index,
        arrayIndex
      });

    this.templateModel.deleteRow(arrayIndex);
  }

  _removeTemplateFromMessageTemplates(index: any) {
    _debugX(RuleMessageTemplatesTableV1.getClassName(), '_removeTemplateFromMessageTemplates',
      {
        index,
      });
    this.message.templates = this.message.templates.filter(el => el.index !== index);
  }

  _addTemplateToTableModel(template: any) {
    _debugX(RuleMessageTemplatesTableV1.getClassName(), '_addTemplateToTableModel',
      {
        template,
      });
    this.templateModel.addRow(this.transformTemplateToRow(template));
  }

  _addTemplate(template: any) {
    _debugX(RuleMessageTemplatesTableV1.getClassName(), '_addTemplate',
      {
        template,
      });
    this.message.templates.push(template);
  }

  private _refreshTemplateIndexes() {
    const TMP_SELECTIONS = {
      templates: {}
    };
    this.message.templates.forEach((template, index) => {
      template.index = index;
      TMP_SELECTIONS.templates[index] = template;
    });
    this.selections = TMP_SELECTIONS;
    _debugX(RuleMessageTemplatesTableV1.getClassName(), '_refreshTemplateIndexes',
      {
        this_selections_templates: this.selections.templates,
        this_message_templates: this.message.templates
      });
  };
}

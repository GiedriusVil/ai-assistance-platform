/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import { Component, OnInit } from '@angular/core';
import { TableHeaderItem, TableItem, TableModel } from 'carbon-components-angular';

import {
  TranslateHelperServiceV1,
} from 'client-shared-services'

import {
  BaseModalV1
} from 'client-shared-views';

@Component({
  selector: 'aiap-lambda-modules-usage-modal-v1',
  templateUrl: './lambda-modules-usage-modal-v1.html',
  styleUrls: ['./lambda-modules-usage-modal-v1.scss'],
})
export class LambdaModuleUsageModalV1 extends BaseModalV1 implements OnInit {

  constructor(private translateService: TranslateHelperServiceV1) {
    super();
  }

  answersSkillsModal = {
    answers: {
      model: new TableModel(),
      search: '',
      total: null,
    },
    skills: {
      model: new TableModel(),
      search: '',
      total: null,
    },
    open: false,
    data: [],
  };

  ngOnInit() {
    this.answersSkillsModal.answers.model.header = [
      new TableHeaderItem({ data: this.translateService.instant('lambda_modules_usage_modal_v1.answers_table_header_item.id') }),
      new TableHeaderItem({ data: this.translateService.instant('lambda_modules_usage_modal_v1.answers_table_header_item.key') }),
      new TableHeaderItem({ data: this.translateService.instant('lambda_modules_usage_modal_v1.answers_table_header_item.store') }),
    ];
    this.answersSkillsModal.skills.model.header = [
      new TableHeaderItem({ data: this.translateService.instant('lambda_modules_usage_modal_v1.skills_table_header_item.id') }),
      new TableHeaderItem({ data: this.translateService.instant('lambda_modules_usage_modal_v1.skills_table_header_item.ai_service_id') }),
      new TableHeaderItem({ data: this.translateService.instant('lambda_modules_usage_modal_v1.skills_table_header_item.name') }),
    ];

    this.answersSkillsModal.answers.model.isRowFiltered = this.searchAnswersSkillsTableFilter(this.answersSkillsModal.answers)
    this.answersSkillsModal.skills.model.isRowFiltered = this.searchAnswersSkillsTableFilter(this.answersSkillsModal.skills)
  }

  show(data) {
    this.clearAnswersSkillsSearchValues();

    this.answersSkillsModal.answers.model.data = data.answers.map(this.convertAnswerToTableRow);
    this.answersSkillsModal.skills.model.data = data.skills.map(this.convertSkillToTableRow);

    this.answersSkillsModal.answers.total = data.answers.length;
    this.answersSkillsModal.skills.total = data.skills.length;

    this.answersSkillsModal.open = true;
  }

  convertAnswerToTableRow(answer) {
    const RET_VAL = [
      new TableItem({ data: answer.id }),
      new TableItem({ data: answer.answerKey }),
      new TableItem({ data: answer.answerStore })
    ];
    return RET_VAL;
  }

  convertSkillToTableRow(skill) {
    const RET_VAL = [
      new TableItem({ data: skill.id }),
      new TableItem({ data: skill.aiServiceId }),
      new TableItem({ data: skill.name })
    ];
    return RET_VAL;
  }

  searchAnswersSkillsTableFilter(table) {
    return (index) => {
      const MODEL = table?.model;
      const SEARCH = table?.search;
      const ROW = MODEL?.row(index);
      return !ROW.some(col => col?.data?.toLowerCase()?.includes(SEARCH.toLowerCase()));
    }
  }

  closeAnswersSkillsModal() {
    this.answersSkillsModal.open = false;
    this.clearAnswersSkillsSearchValues();
  }

  clearAnswersSkillsSearchValues() {
    this.clearSearchValue(this.answersSkillsModal.answers);
    this.clearSearchValue(this.answersSkillsModal.skills);
  }

  clearSearchValue(value) {
    value.search = '';
  }
}

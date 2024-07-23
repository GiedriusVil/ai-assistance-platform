/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import * as ramda from 'ramda';

import { _debugX } from 'client-shared-utils';

import {
  InternalEvent,
  styleUtils,
} from '@maxgraph/core';

import {
  MaxGraphBaseCell,
  baseToolbarUtils,
} from '../../max-graph-base-editor';

import { MaxGraphToolbarAiSkill } from '../toolbars';
import { MaxGraphAiSkill } from '../graphs';
import { MaxGeometryAiSkillNodeResponse } from '../geometries';

export class MaxGraphCellAiSkillNodeResponse extends MaxGraphBaseCell {

  static getClassName() {
    return 'MaxGraphCellAiSkillNodeResponse';
  }

  static DEFAULT_ICON = '/assets/maxgraph/images/dialog-node-response.svg';

  static DEFAULT_WIDTH = 360;
  static DEFAULT_HEIGHT = 100;

  static DEFAULT_DELTA_X = 10;
  static DEFAULT_DELTA_Y = 10;

  public configuration: any = {
    title: 'AI SKILL NODE RESPONSE',
    image: MaxGraphCellAiSkillNodeResponse.DEFAULT_ICON,
  };

  constructor(data: any) {
    super();
    this.data = data;
    this.setId(data?.id);
    let title = `
      Id: ${data?.id}
      ParentId: ${data?.parentId}
      PreviousSiblingId: ${data?.prevSiblingId}
      Title: ${data?.title}
      Conditions: ${data?.conditions}
      Output: ${JSON.stringify(ramda.path(['output', 'generic', 0], data))}
    `;

    this.setVertex(true);
    this.setValue(title);

    this.setStyle({
      labelPosition: 'center',
      align: 'left',
      verticalAlign: 'top',
      spacingLeft: 5,
    });
  }

  static add2Toolbar(toolbar: MaxGraphToolbarAiSkill, graph: MaxGraphAiSkill) {
    const DATA = {};

    const GEOMETRY = new MaxGeometryAiSkillNodeResponse(
      0,
      0,
      MaxGraphCellAiSkillNodeResponse.DEFAULT_WIDTH,
      MaxGraphCellAiSkillNodeResponse.DEFAULT_HEIGHT
    );

    const CELL = new MaxGraphCellAiSkillNodeResponse(DATA);
    CELL.setVertex(true);
    CELL.setGeometry(GEOMETRY);

    const IMAGE = baseToolbarUtils.addItem(toolbar, graph, CELL);

    IMAGE.enabled = true;

    graph.getSelectionModel().addListener(InternalEvent.CHANGE, () => {
      const IS_SELECTION_EMTPY = graph.isSelectionEmpty();
      styleUtils.setOpacity(IMAGE, IS_SELECTION_EMTPY ? 100 : 20);
      IMAGE.enabled = IS_SELECTION_EMTPY;
    });
  }

}

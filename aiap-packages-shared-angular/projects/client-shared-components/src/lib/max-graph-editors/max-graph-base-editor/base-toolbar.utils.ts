/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'max-graph-ai-skill-editor-utils-toolbar-utils';

import {
  InternalEvent,
  Cell,
} from '@maxgraph/core';

import { _debugX } from 'client-shared-utils';

import { MaxGraphBaseToolbar } from './base-toolbar';
import { MaxGraphBaseGraph } from './base-graph';
import { MaxGraphBaseCell } from './base-cell';

import * as gestureUtils from './base-gestures.utils';


export function addItem(
  toolbar: MaxGraphBaseToolbar,
  graph: MaxGraphBaseGraph,
  prototype: MaxGraphBaseCell,
) {
  _debugX(MODULE_ID, 'onItemDropEvent', { toolbar, graph, prototype });

  // Function that is executed when the image is dropped on
  // the graph. The cell argument points to the cell under
  // the mousepointer if there is one.
  const onItemDropEvent = (
    graph: MaxGraphBaseGraph,
    evt: MouseEvent,
    cell: Cell | null,
    x?: number,
    y?: number
  ) => {
    _debugX(MODULE_ID, 'onItemDropEvent', { graph, evt, cell, x, y });
    graph.stopEditing(false);
    const VERTEX: Cell = graph.getDataModel().cloneCell(prototype);
    VERTEX.geometry.x = x;
    VERTEX.geometry.y = y;
    graph.addCell(VERTEX, null);
    graph.setSelectionCell(VERTEX);
  };


  // Creates the image which is used as the drag icon (preview)
  const IMAGE: any = toolbar.addMode(
    prototype?.configuration?.title,
    prototype?.configuration?.image,
    (
      event: any,
      cell: Cell
    ) => {
      const POINT_FOR_EVENT = graph.getPointForEvent(event);
      onItemDropEvent(
        graph,
        event,
        cell,
        POINT_FOR_EVENT?.x,
        POINT_FOR_EVENT?.y,
      );
    },
    null,
  );
  toolbar.addBreak();

  // Disables dragging if element is disabled. This is a workaround
  // for wrong event order in IE. Following is a dummy listener that
  // is invoked as the last listener in IE.
  InternalEvent.addListener(
    IMAGE,
    'mousedown',
    (evt: any) => {
      // do nothing
    });

  // This listener is always called first before any other listener
  // in all browsers.
  InternalEvent.addListener(
    IMAGE,
    'mousedown',
    (evt: any) => {
      if (
        IMAGE.enabled == false
      ) {
        InternalEvent.consume(evt);
      }
    });
  gestureUtils.makeDraggable(graph, IMAGE, prototype, onItemDropEvent);
  return IMAGE;
}

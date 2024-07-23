/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'max-graph-ai-skill-editor-base-gestures-utils';

import { _debugX } from 'client-shared-utils';

import {
  DragSource,
  Point,
  Graph,
  Cell,
  constants,
} from '@maxgraph/core';

export type DropHandler = (
  graph: Graph,
  evt: MouseEvent,
  cell: Cell | null,
  x?: number,
  y?: number
) => void;

export const makeDraggable = (
  graphF: Graph | Function,
  element: Element,
  prototype: Cell,
  dropHandler: DropHandler,
  autoscroll: boolean = true,
  scalePreview: boolean = true,
  highlightDropTargets: boolean = true,
  getDropTarget: ((graph: Graph, x: number, y: number, evt: MouseEvent) => Cell) | null = null
) => {

  _debugX(MODULE_ID, 'makeDraggable', {
    graphF,
    element,
    prototype,
    dropHandler,
    autoscroll,
    scalePreview,
    highlightDropTargets,
    getDropTarget,
  })

  const dragSource = new DragSource(element, dropHandler);

  dragSource.dragElementZIndex = 99999;

  dragSource.dragOffset = new Point(
    0,
    constants.TOOLTIP_VERTICAL_OFFSET
  );

  dragSource.autoscroll = autoscroll;

  // Cannot enable this by default. This needs to be enabled in the caller
  // if the funct argument uses the new x- and y-arguments.
  dragSource.setGuidesEnabled(false);

  if (highlightDropTargets != null) {
    dragSource.highlightDropTargets = highlightDropTargets;
  }

  // Overrides function to find drop target cell
  if (
    getDropTarget != null
  ) {
    dragSource.getDropTarget = getDropTarget;
  }

  // Overrides function to get current graph
  dragSource.getGraphForEvent = (
    event: any
  ) => {
    const TMP_RET_VAL = typeof graphF === 'function' ? graphF(event) : graphF;
    return TMP_RET_VAL;
  };

  // Translates switches into dragSource customizations

  dragSource.createDragElement = () => {
    const TMP_ELEMENT = <HTMLElement>element.cloneNode(true);
    const TMP_GRAPH: any = graphF;
    const TMP_WIDTH = prototype?.geometry?._width || parseInt(TMP_ELEMENT.style.width) || 200;
    const TMP_HEIGHT = prototype?.geometry?._height || parseInt(TMP_ELEMENT.style.height) || 100;
    TMP_ELEMENT.style.width = `${Math.round(TMP_WIDTH * TMP_GRAPH.view.scale)}px`;
    TMP_ELEMENT.style.height = `${Math.round(TMP_HEIGHT * TMP_GRAPH.view.scale)}px`;
    return TMP_ELEMENT;
  };

  if (scalePreview) {
    dragSource.createPreviewElement = (graph: any) => {
      const TMP_ELEMENT = <HTMLElement>element.cloneNode(true);
      const TMP_GRAPH: any = graphF;
      const TMP_WIDTH = prototype?.geometry?._width || parseInt(TMP_ELEMENT.style.width) || 200;
      const TMP_HEIGHT = prototype?.geometry?._height || parseInt(TMP_ELEMENT.style.height) || 100;
      TMP_ELEMENT.style.width = `${Math.round(TMP_WIDTH * TMP_GRAPH.view.scale)}px`;
      TMP_ELEMENT.style.height = `${Math.round(TMP_HEIGHT * TMP_GRAPH.view.scale)}px`;
      return TMP_ELEMENT;
    };
  }

  return dragSource;
};



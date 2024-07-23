/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';

import {
  ArrowShape,
  Cell,
  CellState,
  CellStyle,
  Client,
  ConnectionHandler,
  constants,
  EventObject,
  EventSource,
  Geometry,
  Graph,
  GraphDataModel,
  GraphPluginConstructor,
  ImageBox,
  InternalEvent,
  InternalMouseEvent,
  KeyHandler,
  mathUtils,
  Point,
  PolylineShape,
  RubberBandHandler,
  Stylesheet,
  styleUtils,
  CellEditorHandler,
  TooltipHandler,
  SelectionCellsHandler,
  PopupMenuHandler,
  SelectionHandler,
  PanningHandler,
} from '@maxgraph/core';

import {
  _debugX,
} from 'client-shared-utils';

import {
  MaxGraphBaseGraph,
} from '../../max-graph-base-editor';

import { MaxGraphConnectionHandlerAiSkill } from '../handlers';

export const DEFAULT_PLUGINS: GraphPluginConstructor[] = [
  CellEditorHandler,
  TooltipHandler,
  SelectionCellsHandler,
  PopupMenuHandler,
  MaxGraphConnectionHandlerAiSkill,
  SelectionHandler,
  PanningHandler,
];

export class MaxGraphAiSkill extends MaxGraphBaseGraph {

  static getClassName() {
    return 'MaxGraphAiSkill';
  }

  constructor(
    container: HTMLElement,
    model?: GraphDataModel,
  ) {
    container.style.background = 'url(/assets/maxgraph/images/grid.gif)';
    super(container, model, DEFAULT_PLUGINS);
    this.setAllowDanglingEdges(false);
    this.setEventTolerance(20);
    this.setConnectable(true);

    //
    // GRAPH.centerZoom = false;
    // GRAPH.setPanning(true);
    // GRAPH.setCellsSelectable(true);
    // this.setMultigraph(false);

    // GRAPH.extendParents = true;
    // GRAPH.extendParentsOnAdd = true;

    this.__initRubberBandHandler();
    this.__initKeyHandler();


    const GRAPH_DEFAULT_EDGE_STYLE = this.getStylesheet().getDefaultEdgeStyle();
    GRAPH_DEFAULT_EDGE_STYLE.edgeStyle = 'orthogonalEdgeStyle';
    GRAPH_DEFAULT_EDGE_STYLE.strokeColor = '#6482b9';
    GRAPH_DEFAULT_EDGE_STYLE.bendable = true;
  }

  __initKeyHandler() {
    const GRAPH_KEY_HANDLER = new KeyHandler(this);
    GRAPH_KEY_HANDLER.bindKey(8, this.__handleSelectionRemovalEvent.bind(this));
    _debugX(MaxGraphAiSkill.getClassName(), '__initKeyHandler', { GRAPH_KEY_HANDLER });
  }

  __initRubberBandHandler() {
    const GRAPH_RUBBER_BAND_HANDLER = new RubberBandHandler(this);
    GRAPH_RUBBER_BAND_HANDLER.createShape = () => {
      if (
        !GRAPH_RUBBER_BAND_HANDLER.sharedDiv
      ) {
        GRAPH_RUBBER_BAND_HANDLER.sharedDiv = document.createElement('div');
        GRAPH_RUBBER_BAND_HANDLER.sharedDiv.className = 'mxRubberband';
        GRAPH_RUBBER_BAND_HANDLER.sharedDiv.style.position = 'absolute';
        GRAPH_RUBBER_BAND_HANDLER.sharedDiv.style.backgroundColor = '#000000';
        styleUtils.setOpacity(GRAPH_RUBBER_BAND_HANDLER.sharedDiv, GRAPH_RUBBER_BAND_HANDLER.defaultOpacity);
      }
      GRAPH_RUBBER_BAND_HANDLER.graph.container.appendChild(GRAPH_RUBBER_BAND_HANDLER.sharedDiv);
      const result = GRAPH_RUBBER_BAND_HANDLER.sharedDiv;
      if (
        Client.IS_SVG &&
        GRAPH_RUBBER_BAND_HANDLER.fadeOut
      ) {
        GRAPH_RUBBER_BAND_HANDLER.sharedDiv = null;
      }
      return result;
    }

    _debugX(MaxGraphAiSkill.getClassName(), '__initRubberBandHandler', { GRAPH_RUBBER_BAND_HANDLER });
  }

  __handleSelectionRemovalEvent(event: any) {
    const SELECTED_CELLS = this.getSelectionCells();
    _debugX(MaxGraphAiSkill.getClassName(), '__handleSelectionRemovalEvent', { event, SELECTED_CELLS });
    if (
      this?.view
    ) {
      this.removeSelectionCells(SELECTED_CELLS);
      this.removeCells(SELECTED_CELLS);
      for (let cell of SELECTED_CELLS) {
        this.view.clear(cell, true, false);
      }
    }
  }


  getAllConnectionConstraints = (terminal: any, source: any) => {
    // Overridden to define per-geometry connection points
    if (terminal && terminal.cell) {
      if (terminal.shape.stencil) {
        if (terminal.shape.stencil.constraints) {
          return terminal.shape.stencil.constraints;
        }
      } else if (terminal.cell.geometry.constraints) {
        return terminal.cell.geometry.constraints;
      }
    }
    return null;
  }

  // fireMouseEvent = (evtName: string, me: InternalMouseEvent, sender: EventSource) => {
  //   // Overrides the mouse event dispatching mechanism to update the
  //   // cell which is associated with the event in case the native hit
  //   // detection did not return anything.
  //   // Checks if native hit detection did not return anything
  //   if (me.getState() == null) {
  //     // Updates the graph coordinates in the event since we need
  //     // them here. Storing them in the event means the overridden
  //     // method doesn't have to do this again.
  //     if (
  //       me.graphX == null ||
  //       me.graphY == null
  //     ) {

  //       const pt = styleUtils.convertPoint(this.container, me.getX(), me.getY());

  //       me.graphX = pt.x;
  //       me.graphY = pt.y;
  //     }

  //     const cell = this.getCellAt(me.graphX, me.graphY);

  //     if (cell?.isEdge()) {
  //       me.state = this.view.getState(cell);

  //       if (me.state != null && me.state.shape != null) {
  //         this.container.style.cursor = me.state.shape.node.style.cursor;
  //       }
  //     }
  //   }
  //   if (me.state == null) {
  //     this.container.style.cursor = 'default';
  //   }
  //   super.fireMouseEvent(evtName, me, sender);
  // }


}

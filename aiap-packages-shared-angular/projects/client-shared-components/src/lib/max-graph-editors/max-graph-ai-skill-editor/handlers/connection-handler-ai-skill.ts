/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  ConnectionHandler,
  CellState,
  InternalMouseEvent,
  CellMarker,
  constants,
} from '@maxgraph/core';


export class MaxGraphConnectionHandlerAiSkill extends ConnectionHandler {

  static getClassName() {
    return 'MaxGraphConnectionHandlerAiSkill';
  }

  // createMarker() {
  //   const RET_VAL = new CellMarker(
  //     this.graph,
  //     constants.DEFAULT_VALID_COLOR,
  //     constants.DEFAULT_INVALID_COLOR,
  //     0.00001,
  //   );
  //   RET_VAL.setHotspotEnabled(false);
  //   // super.createMarker();
  //   RET_VAL.hotspotEnabled = false;
  //   return RET_VAL;
  // }

    // GRAPH_CONNECTION_HANDLER.marker.setHotspot(0.0000000000001);
  // GRAPH_CONNECTION_HANDLER.marker.intersects = (
  //   state: CellState,
  //   me: InternalMouseEvent
  // ) => {
  //   return false;
  // }

  createEdgeState(me: InternalMouseEvent) {
    const edge = this.createEdge(null, null, null, {
      bendable: true,
      strokeColor: '#6482b9'
    });
    return new CellState(this.graph.view, edge, this.graph.getCellStyle(edge));
  }



  drawPreview() {
    this.updatePreview(this.error === null);
    if (
      this.shape
    ) {
      const COLOR = '#6482b9';
      this.shape.stroke = COLOR;
      this.shape.strokeWidth = 2;
      this.shape.endSize = 6;
      this.shape.endArrow = 'classic';
      this.shape.redraw();
    }
  }

}

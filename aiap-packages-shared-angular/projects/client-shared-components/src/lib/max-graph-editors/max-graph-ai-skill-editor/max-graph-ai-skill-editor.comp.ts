/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

import * as lodash from 'lodash';

import {
  Client,
  MaxToolbar,
  ConnectionHandler,
  ImageBox,
  InternalEvent,
  Graph,
  GraphDataModel,
  KeyHandler,
  RubberBandHandler,
  CompactTreeLayout,
  Outline,
  PolylineShape,
  CellState,
  InternalMouseEvent,
  styleUtils,
  LayoutManager,
  AlignValue,
  Cell,
  CellStyle,
  Geometry,
  ArrowConnectorShape,
} from '@maxgraph/core';

import {
  _debugX,
} from 'client-shared-utils';

import {
  MaxGraphToolbarAiSkill,
} from './toolbars';

import {
  MaxGraphAiSkill,
} from './graphs';

import {
  MaxGraphCellAiSkillNodeResponse,
  MaxGraphCellAiSkillNode,
} from './cells';

import {
  MaxGeometryAiSkillNodeResponse,
  MaxGeometryAiSkillNode,
} from './geometries';

declare interface DiagramEditorState {
  toolbar: undefined | MaxGraphToolbarAiSkill,
  graph: undefined | MaxGraphAiSkill,
  graphDataModel: undefined | GraphDataModel,
  graphOutline: undefined | Outline,
  graphLayout: undefined | CompactTreeLayout,
  graphScale: number,
  graphScaleItems: Array<any>,
  cellRoot: undefined | MaxGraphCellAiSkillNode,
}

const GRAPH_SCALE_ITEMS = [
  {
    content: '25 %',
    value: 0.25,
  },
  {
    content: '50 %',
    value: 0.50,
  },
  {
    content: '75 %',
    value: 0.75,
  },
  {
    content: '100 %',
    value: 1,
  }
];


@Component({
  selector: 'max-graph-ai-skill-editor',
  templateUrl: './max-graph-ai-skill-editor.comp.html',
  styleUrls: ['./max-graph-ai-skill-editor.comp.html'],
})
export class MaxGraphAiSkillEditor implements OnInit, OnChanges {

  static getClassName() {
    return 'MaxGraphAiSkillEditor';
  }

  @ViewChild('maxToolbar', { static: true }) elToolbar: ElementRef<HTMLElement>;
  @ViewChild('maxGraph', { static: true }) elGraph: ElementRef<HTMLElement>;

  @Input() value: any;
  @Input() configuration: any;

  _state: DiagramEditorState = {
    toolbar: undefined,
    graph: undefined,
    graphDataModel: undefined,
    graphOutline: undefined,
    graphLayout: undefined,
    graphScale: 0.5,
    graphScaleItems: [
      ...GRAPH_SCALE_ITEMS
    ],
    cellRoot: undefined,
  }
  state = lodash.cloneDeep(this._state);

  constructor() { }

  ngOnInit() {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes?.value &&
      this.value?.external?.dialog_nodes &&
      this.state.graph &&
      this.state.graphDataModel
    ) {
      this.state.graphDataModel.clear();
      if (
        !lodash.isEmpty(this.value?.external?.dialog_nodes) &&
        lodash.isArray(this.value?.external?.dialog_nodes)
      ) {
        this.setDialogNodes(this.value?.external?.dialog_nodes);
      }
    }
  }

  setDialogNodes(nodes: any) {
    const MAP_NODES: any = {};
    const MAP_NODE_RESPONSES: any = {};
    this.state.graph.batchUpdate(() => {
      const PARENT: any = this.state.graph.getDefaultParent();
      this.state.cellRoot = new MaxGraphCellAiSkillNode(
        {
          title: this.value?.name ? this.value?.name : 'UNKNOWN',
          id: 'root',
        }
      );
      this.state.cellRoot.setParent(PARENT);
      MAP_NODES[this.state.cellRoot.getId()] = {
        cell: this.state.cellRoot,
        children: [],
        childrenUnsorted: [],
        responses: [],
        responsesUnsorted: [],
      };
      // Constructing MAP_NODES
      for (let dialogNode of nodes) {
        if (
          !lodash.isEmpty(dialogNode?.dialog_node) &&
          !dialogNode?.dialog_node.startsWith('response_')
        ) {
          let cell = new MaxGraphCellAiSkillNode({
            ...dialogNode,
            id: dialogNode?.dialog_node,
            parentId: dialogNode?.parent ? dialogNode?.parent : 'root',
            prevSiblingId: dialogNode?.previous_sibling,
          });
          let cellId = cell.getId();
          MAP_NODES[cellId] = {
            cell,
            children: [],
            childrenUnsorted: [],
            responses: [],
            responsesUnsorted: [],
          }
        }
      }
      // Constructing MAP_NODE_RESPONSES
      for (let dialogNode of nodes) {
        if (
          !lodash.isEmpty(dialogNode?.dialog_node) &&
          dialogNode?.dialog_node.startsWith('response_')
        ) {
          let cell = new MaxGraphCellAiSkillNodeResponse({
            ...dialogNode,
            id: dialogNode?.dialog_node,
            parentId: dialogNode?.parent,
            prevSiblingId: dialogNode?.previous_sibling,
          });
          let cellId = cell.getId();
          let cellParentId = cell?.data?.parentId;
          let nodeResponse = {
            cell: cell,
          };
          let nodeParent = MAP_NODES[cellParentId];
          MAP_NODE_RESPONSES[cellId] = nodeParent;
          if (
            nodeParent
          ) {
            nodeResponse.cell.setParent(nodeParent.cell);
            nodeParent.responsesUnsorted.push(nodeResponse);
          }
        }
      }

      // Map children nodes to parents
      for (let nodeId of Object.keys(MAP_NODES)) {
        let node = MAP_NODES[nodeId];
        let nodeParentId = node?.cell?.data?.parentId;
        let nodeParent = MAP_NODES[nodeParentId];
        if (
          nodeParent
        ) {
          nodeParent.childrenUnsorted.push(node);
        }
      }

      // Sort childrenUnsorted
      for (let nodeId of Object.keys(MAP_NODES)) {
        let node = MAP_NODES[nodeId];
        let nodeChildrenUnsorted = node?.childrenUnsorted;
        if (
          !lodash.isEmpty(nodeChildrenUnsorted) &&
          lodash.isArray(nodeChildrenUnsorted)
        ) {
          const ARRAY_SORTED = this.arraySortedBySiblingId(nodeChildrenUnsorted);
          node.children.push(...ARRAY_SORTED);
        }
      }

      // Sort responsesUnsorted
      for (let nodeId of Object.keys(MAP_NODES)) {
        let node = MAP_NODES[nodeId];
        let nodeResponsesUnsorted = node?.responsesUnsorted;
        if (
          !lodash.isEmpty(nodeResponsesUnsorted) &&
          lodash.isArray(nodeResponsesUnsorted)
        ) {
          const ARRAY_SORTED = this.arraySortedBySiblingId(nodeResponsesUnsorted);
          node.responses.push(...ARRAY_SORTED);
        }
      }

      const ROOT_NODE = MAP_NODES['root'];

      _debugX(MaxGraphAiSkillEditor.getClassName(), 'setDialogNodes', {
        MAP_NODES,
        ROOT_NODE,
      });

      this.addDialogNodeToGraph(null, 0, ROOT_NODE);

      for (let dialogNode of nodes) {
        let sourceDialogNodeId = dialogNode?.parent;
        let sourceCell = MAP_NODES[sourceDialogNodeId]?.cell ? MAP_NODES[sourceDialogNodeId]?.cell : this.state.cellRoot;
        let targetDialogNodeId = dialogNode?.dialog_node;
        let targetCell = MAP_NODES[targetDialogNodeId]?.cell;
        if (
          !lodash.isEmpty(dialogNode?.dialog_node) &&
          !dialogNode?.dialog_node?.startsWith('response_') &&
          sourceCell &&
          targetCell
        ) {
          // this.state.graph.insertEdge(PARENT, null, '', sourceCell, targetCell);
          this.state.graph.insertEdge({
            PARENT,
            source: sourceCell,
            target: targetCell,
            style: {
              edgeStyle: 'elbowEdgeStyle',
              // orthogonalEdgeStyle
            },
          });
        }
      }
      // this.state.graphLayout.execute(PARENT);
      this.setGraphScale(this.state.graphScale);
      this.state.graph.scrollCellToVisible(this.state.cellRoot, true);
    });
  }

  arraySortedBySiblingId(items: Array<any>) {
    const RET_VAL = [];
    let index = this.findIndexOfFirstByPrevSiblingId(items);
    let item;
    while (index >= 0) {
      item = items.splice(index, 1)[0];
      RET_VAL.push(item);
      index = this.findIndexOfItemNextSibling(item, items);
    }
    if (
      !lodash.isEmpty(items)
    ) {
      RET_VAL.push(...items);
    }
    return RET_VAL;
  }

  findIndexOfFirstByPrevSiblingId(items: Array<any>) {
    // MAGIC --> TODO --> [LEGO] return -> Execute 2 loops in parallel maybe ? 
    const RET_VAL = items.findIndex((item: any) => {
      const IS_PREV_SIBLING_ID_EMPTY = lodash.isEmpty(item?.cell?.data?.prevSiblingId);
      const DOES_SIBLING_EXISTS = items.find((tmpItem: any) => {
        return item?.cell?.data?.prevSiblingId === tmpItem?.cell?.data?.id;
      });
      let retVal = IS_PREV_SIBLING_ID_EMPTY || !DOES_SIBLING_EXISTS;
      return retVal;
    });
    return RET_VAL;
  }

  findIndexOfItemNextSibling(item: any, items: Array<any>) {
    const RET_VAL = items.findIndex((tmpItem: any) => {
      let retVal =
        !lodash.isEmpty(tmpItem?.cell?.data?.id) &&
        !lodash.isEmpty(tmpItem?.cell?.data?.prevSiblingId) &&
        tmpItem?.cell?.data?.prevSiblingId === item?.cell?.data?.id;
      return retVal;
    });
    return RET_VAL;
  }

  setGraphScale(scale: number) {
    const NEW_GRAPH_SCALE_ITEMS: Array<any> = [
      {
        content: `${Math.abs(scale * 100)} %`,
        selected: true,
        value: scale
      }
    ];
    for (let item of GRAPH_SCALE_ITEMS) {
      if (
        scale !== item?.value
      ) {
        NEW_GRAPH_SCALE_ITEMS.push(item);
      }
    }
    NEW_GRAPH_SCALE_ITEMS.sort((a: any, b: any) => {
      if (
        a?.value > b?.value
      ) {
        return 1;
      } else if (
        a?.value < b?.value
      ) {
        return -1;
      } else {
        return 0;
      }
    })
    this.state.graphScaleItems = NEW_GRAPH_SCALE_ITEMS;
    this.state.graphScale = scale;
    this.state.graph.view.setScale(scale);
  }

  addDialogNodeToGraph(parentNode: any, index: number, node: any) {
    let dx = 10;
    let dy = 10;
    let width = MaxGraphCellAiSkillNode.DEFAULT_WIDTH;
    let height = MaxGraphCellAiSkillNode.DEFAULT_HEIGHT;

    // calculate coordinates & size
    if (
      parentNode
    ) {
      let tmpGeometry;
      if (
        index === 0
      ) {
        tmpGeometry = parentNode?.cell?.getGeometry();
        if (
          tmpGeometry
        ) {
          dx =
            tmpGeometry._x
            + (tmpGeometry._width)
            // + (tmpGeometry._width / 2)
            + MaxGraphCellAiSkillNode.DEFAULT_DELTA_X
            ;

          dy =
            tmpGeometry._y
            // + tmpGeometry._height
            // + MaxGraphCellAiSkillNode.DEFAULT_DELTA_Y
            ;
        }

      } else if (
        index > 0
      ) {

        let prevSibNode = parentNode?.children[index - 1];
        let prevSibNodeGeometry = prevSibNode?.cell?.getGeometry();
        if (
          lodash.isArray(prevSibNode?.children) &&
          lodash.isEmpty(prevSibNode?.children)
        ) {
          if (
            prevSibNodeGeometry
          ) {
            dx = prevSibNodeGeometry._x;
            dy =
              prevSibNodeGeometry._y
              + prevSibNodeGeometry._height
              + MaxGraphCellAiSkillNode.DEFAULT_DELTA_Y;
          }

        } else if (
          lodash.isArray(prevSibNode?.children) &&
          !lodash.isEmpty(prevSibNode?.children)
        ) {

          // find last sibling node -> children ... -> children last geometry...
          let tmpPrevSiblingChildrenLast = lodash.last<{
            cell: MaxGraphCellAiSkillNode,
            children: [],
          }>(prevSibNode?.children);

          while (
            lodash.isArray(tmpPrevSiblingChildrenLast?.children) &&
            !lodash.isEmpty(tmpPrevSiblingChildrenLast?.children)
          ) {
            tmpPrevSiblingChildrenLast = lodash.last<{
              cell: MaxGraphCellAiSkillNode,
              children: [],
            }>(tmpPrevSiblingChildrenLast?.children);
          }
          tmpGeometry = tmpPrevSiblingChildrenLast?.cell?.getGeometry();
          if (
            tmpGeometry
          ) {
            dx = prevSibNodeGeometry._x;
            dy = tmpGeometry._y + tmpGeometry._height + MaxGraphCellAiSkillNode.DEFAULT_DELTA_Y;
          }
        }
      }
    }
    if (
      !lodash.isEmpty(node?.responses) &&
      lodash.isArray(node?.responses)
    ) {
      height =
        height
        + node?.responses.length * (
          MaxGraphCellAiSkillNodeResponse.DEFAULT_HEIGHT +
          MaxGraphCellAiSkillNodeResponse.DEFAULT_DELTA_Y
        );
    }
    let geometry = new MaxGeometryAiSkillNode(dx, dy, width, height);
    if (
      node?.cell
    ) {
      node.cell.setGeometry(geometry);
      this.state.graph.addCell(node.cell, null);
      this.addDialogNodeResponsesToGraph(node);
    }
    if (
      lodash.isArray(node?.children) &&
      !lodash.isEmpty(node?.children)
    ) {
      for (const [index, value] of node.children.entries()) {
        this.addDialogNodeToGraph(node, index, value);
      }
    }
  }

  addDialogNodeResponsesToGraph(
    dialogNode: {
      cell: MaxGraphCellAiSkillNode,
      responses: Array<any>,
      children: Array<any>,
    }
  ) {
    if (
      !lodash.isEmpty(dialogNode?.responses) &&
      lodash.isArray(dialogNode?.responses)
    ) {
      for (const [index, value] of dialogNode?.responses.entries()) {
        this.addDialogNodeResponseToGraph(dialogNode, index, value);
      }
    }
  }

  addDialogNodeResponseToGraph(
    dialogNode: {
      cell: MaxGraphCellAiSkillNode,
      responses: Array<any>,
      children: Array<any>,
    },
    index: number,
    dialogNodeResponse: {
      cell: MaxGraphCellAiSkillNodeResponse,
    }
  ) {

    if (
      dialogNode?.cell &&
      dialogNode?.cell?.getGeometry() &&
      dialogNodeResponse?.cell
    ) {

      const DIALOG_NODE_CELL_GEOMETRY = dialogNode?.cell?.getGeometry();

      const DX =
        // DIALOG_NODE_CELL_GEOMETRY._x +
        (MaxGraphCellAiSkillNode.DEFAULT_WIDTH - MaxGraphCellAiSkillNodeResponse.DEFAULT_WIDTH) / 2;

      const DY =
        // DIALOG_NODE_CELL_GEOMETRY._y +
        MaxGraphCellAiSkillNode.DEFAULT_HEIGHT + index * (
          MaxGraphCellAiSkillNodeResponse.DEFAULT_HEIGHT +
          MaxGraphCellAiSkillNodeResponse.DEFAULT_DELTA_Y
        );

      const WIDTH = MaxGraphCellAiSkillNodeResponse.DEFAULT_WIDTH;
      const HEIGTH = MaxGraphCellAiSkillNodeResponse.DEFAULT_HEIGHT;

      const GEOMETRY = new MaxGeometryAiSkillNodeResponse(DX, DY, WIDTH, HEIGTH);

      dialogNodeResponse.cell.setGeometry(GEOMETRY);
      this.state.graph.addCell(dialogNodeResponse.cell, dialogNode.cell);

    }
  }

  handleZoomInClickEvent(event: any) {
    _debugX(MaxGraphAiSkillEditor.getClassName(), 'handleZoomInClickEvent', {
      event: event,
      this_state_graph: this.state?.graph,
      this_state_graph_view_scale: this.state?.graph?.view?.scale,
    });
    this.setGraphScale(this.state.graphScale + 0.1);
  }

  handleZoomOutClickEvent(event: any) {
    _debugX(MaxGraphAiSkillEditor.getClassName(), 'handleZoomOutClickEvent', {
      event: event,
      this_state_graph: this.state?.graph,
      this_state_graph_view_scale: this.state?.graph?.view?.scale,
    });
    if (
      this.state.graphScale > 0.1
    ) {
      this.setGraphScale(this.state.graphScale - 0.1);
      // this.state.graph.scrollCellToVisible(this.state.cellRoot, true);
    }
  }

  handleScaleSelectEvent(event: any) {
    _debugX(MaxGraphAiSkillEditor.getClassName(), 'handleZoomOutClickEvent', {
      event: event,
    });
    if (
      event?.item?.value > 0
    ) {
      this.setGraphScale(event?.item?.value);
    }
  }

  init() {
    Client.setImageBasePath('/assets/maxgraph/images');

    this.state.toolbar = this.initMaxToolbar();
    this.initGraph();
    this.initVertexes();
  }

  initGraph() {
    const GRAPH_DATA_MODEL = new GraphDataModel();

    // InternalEvent.disableContextMenu(this.elGraph.nativeElement);

    const GRAPH = new MaxGraphAiSkill(this.elGraph.nativeElement, GRAPH_DATA_MODEL);


    // PolylineShape.prototype['constraints'] = null;
    // const panningHandler: any = GRAPH.getPlugin('PanningHandler');    
    // panningHandler.useLeftButtonForPanning = true;

    // const graphHandler: any = GRAPH.getPlugin('SelectionHandler');

    // graphHandler.scaleGrid = true;
    this.state.graph = GRAPH;

    // this.state.graphOutline = new Outline(this.state.graph);

    this.state.graphDataModel = GRAPH_DATA_MODEL;
    // this.state.graphLayout = GRAPH_LAYOUT;
  }

  initMaxToolbar(): MaxToolbar {
    let toolbar;
    if (
      this.elToolbar
    ) {
      toolbar = new MaxToolbar(this.elToolbar.nativeElement);
      toolbar.enabled = false;
    }
    return toolbar;
  }

  initVertexes() {
    if (
      this.state.graph &&
      this.state.toolbar
    ) {
      MaxGraphCellAiSkillNode.add2Toolbar(this.state.toolbar, this.state.graph);
      MaxGraphCellAiSkillNodeResponse.add2Toolbar(this.state.toolbar, this.state.graph);
    }
  }
}

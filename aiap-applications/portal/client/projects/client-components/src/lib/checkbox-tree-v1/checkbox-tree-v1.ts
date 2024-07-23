/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-checkbox-tree-v1',
  templateUrl: './checkbox-tree-v1.html',
  styleUrls: ['./checkbox-tree-v1.scss']
})
export class CheckboxTreeV1 implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'CheckboxTreeV1';
  }

  @Input() items: any[];
  @Output() itemsChange = new EventEmitter<any>();
  @Input() useDefaultSearch = true;
  @Output() onSearch = new EventEmitter<any>();
  @Input() searchableItems: any[];

  @Input() viewsField = 'views';
  @Input() actionsField = 'actions';
  @Input() maxHeight = 20;

  selectAll = false;

  viewType = {
    single: 'SINGLE_VIEW',
    multi: 'MULTI_VIEW',
  };

  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }

  ngOnChanges(changes: SimpleChanges): void {
    //
  }

  ngOnDestroy(): void {
    //
  }

  handleSelectAll(event: any): void {
    const CHECKED = event?.checked;
    const ITEMS = this.items?.map(item => {
      item.checked = CHECKED;

      if (
        lodash.isArray(item[this.viewsField])
      ) {
        item[this.viewsField]?.forEach(singleView => {
          singleView.checked = CHECKED;
          if (
            lodash.isArray(singleView[this.actionsField])
          ) {
            singleView[this.actionsField].forEach(action => {
              action.checked = CHECKED;
            });
          }
        });
      } else {
        const ACTIONS = item?.[this.actionsField]?.map(action => {
          action.checked = CHECKED;
          return action;
        });
        item.actions = ACTIONS;
      }
      return item;
    });
    this.items = ITEMS;
  }

  handleSelectItem(event: any, item: any): void {
    const CHECKED = event?.checked;

    this.items?.forEach(el => {
      const ACTIONS = el?.[this.actionsField];
      if (lodash.isEqual(el?.name, item?.name)) {
        el.checked = CHECKED;
        ACTIONS?.forEach(action => {
          action.checked = CHECKED;
        });
      }
    });
  }

  handleSelectItemAction(event: any, item: any, action: any): void {
    const CHECKED = event?.checked;
    this.items?.forEach(el => {
      const ACTIONS = el?.[this.actionsField];

      if (lodash.isEqual(el?.name, item?.name)) {
        const ACTION = ACTIONS?.find(el => el?.name === action?.name);
        ACTION.checked = CHECKED;

        const ARE_UNCHECKED = ACTIONS?.find(el => !el?.checked);
        if (!ARE_UNCHECKED) {
          el.checked = true;
        } else {
          el.checked = false;
        }
      }
    });
  }

  handleSelectMultiViewItem(event: any, item: any, index: number): void {
    const CHECKED = event?.checked;
    this.items?.forEach(el => {
      if (el?.type === this.viewType.multi && lodash.isEqual(el?.name, item?.name)) {
        const ITEM_VIEWS = el?.[this.viewsField] || [];
        ITEM_VIEWS.forEach((itemView, itemViewIndex) => {
          if (lodash.isEqual(itemViewIndex, index)) {
            itemView.checked = CHECKED;
            const ACTIONS = itemView?.[this.actionsField];
            ACTIONS?.forEach(action => {
              action.checked = CHECKED;
            });
          }
        })
      }
    });
  }

  handleSelectMultiViewItemAction(event: any, item: any, action: any, index: number): void {
    const CHECKED = event?.checked;
    this.items?.forEach(el => {
      if (el?.type === this.viewType.multi && lodash.isEqual(el?.name, item?.name)) {
        const ITEM_VIEWS = el?.[this.viewsField];
        ITEM_VIEWS?.forEach((itemView, itemViewIndex) => {
          if (lodash.isEqual(itemViewIndex, index)) {
            const ACTIONS = itemView[this.actionsField];
            const ACTION = ACTIONS?.find(el => el?.name === action?.name);

            if (!lodash.isEmpty(ACTION)) {
              ACTION.checked = CHECKED;
            }

            const ARE_UNCHECKED = ACTIONS?.find(el => !el?.checked);
            if (!ARE_UNCHECKED) {
              itemView.checked = true;
            } else {
              itemView.checked = false;
            }
          }
        });
      }
    });
  }

  resetCheckboxes(): void {
    if (!lodash.isEmpty(this.items) && lodash.isArray(this.items)) {
      this.selectAll = false;

      this.items.forEach(item => {
        item.checked = false;

        if (lodash.isArray(item[this.viewsField])) {
          item[this.viewsField].forEach(singleView => {
            singleView.checked = false;

            const ACTIONS = singleView?.[this.actionsField];
            if (lodash.isArray(ACTIONS)) {
              ACTIONS.forEach(action => {
                action.checked = false;
              });
            }
          });
        } else {
          const ACTIONS = item?.[this.actionsField];
          if (lodash.isArray(ACTIONS)) {
            ACTIONS.forEach(action => {
              action.checked = false;
            });
          }
        }
      });
    }
  }

  getIfItemIncludesSearch = (fields: string[], item: any, search: string) => {
    let includes = false;
    if (
      lodash.isArray(fields)
    ) {
      includes = !!fields.find(field => item[field]?.toLowerCase()?.includes(search) || false);
    }
    return includes;
  }

  getSearchedActions = (fields: string[], actions: any[], search: string) => {
    let filteredActions: any[] = [];
    if (lodash.isArray(fields) && lodash.isArray(actions)) {
      filteredActions = actions.filter(action => this.getIfItemIncludesSearch(fields, action, search));
    }
    return filteredActions;
  }

  handleSearch(event: any) {
    const SEARCH = event?.toLowerCase();

    if (
      this.useDefaultSearch
    ) {
      const SEARCHABLE_ITEMS = lodash.cloneDeep(this.searchableItems);

      if (
        !lodash.isEmpty(SEARCHABLE_ITEMS)
      ) {
        const FILTERED_ITEMS = [];

        SEARCHABLE_ITEMS.forEach(item => {
          const ITEM_VIEWS = item?.[this.viewsField];

          if (
            lodash.isArray(ITEM_VIEWS)
          ) {
            const FILTERED_VIEW_VIEWS = [];

            ITEM_VIEWS.forEach(singleView => {
              const VIEW_INCLUDES_SEARCH = this.getIfItemIncludesSearch(['name', 'component'], singleView, SEARCH);
              const ACTIONS_INCLUDE_SEARCH = this.getSearchedActions(['name', 'component'], singleView?.[this.actionsField], SEARCH);

              if (VIEW_INCLUDES_SEARCH) {
                FILTERED_VIEW_VIEWS.push(singleView);
              } else if (!lodash.isEmpty(ACTIONS_INCLUDE_SEARCH)) {
                singleView[this.actionsField] = ACTIONS_INCLUDE_SEARCH;
                FILTERED_VIEW_VIEWS.push(singleView);
              }
            });
            FILTERED_ITEMS.push(...FILTERED_VIEW_VIEWS);
          } else {
            const VIEW_INCLUDES_SEARCH = this.getIfItemIncludesSearch(['name', 'component'], item, SEARCH);
            const ACTIONS_INCLUDE_SEARCH = this.getSearchedActions(['name', 'component'], item?.[this.actionsField], SEARCH);

            if (VIEW_INCLUDES_SEARCH) {
              FILTERED_ITEMS.push(item);
            } else if (!lodash.isEmpty(ACTIONS_INCLUDE_SEARCH)) {
              item[this.actionsField] = ACTIONS_INCLUDE_SEARCH;
              FILTERED_ITEMS.push(item);
            }
          }
        });
        const EVENT = { views: FILTERED_ITEMS };
        this.onSearch.emit(EVENT);
      }
    } else {
      this.onSearch.emit(SEARCH);
    }
  }

  hanleClearSearchEvent(event: any) {
    this.onSearch.emit('');
    this.handleSearch('');
  }

  hasDescription(item: any) {
    const DESCRIPTION = item?.description;
    let retVal = false;
    if (!lodash.isEmpty(DESCRIPTION)) {
      retVal = true;
    }
    return retVal;
  }
}

/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  User,
  DEFAULT_TABLE,
  defaultQuery,
  parsePageNumberFromURL,
} from 'client-utils';

import {
  BaseView
} from 'client-shared-views';

import { UserSaveModalV1 } from './user-save-modal-v1/user-save-modal-v1';
import { UserDeleteModalV1 } from './user-delete-modal-v1/user-delete-modal-v1';

@Component({
  selector: 'aiap-users-view-v1',
  templateUrl: './users-view-v1.html',
  styleUrls: ['./users-view-v1.scss'],
})
export class UsersViewV1 extends BaseView implements OnInit {

  static getClassName() {
    return 'UsersViewV1';
  }

  @ViewChild('userSaveModal') userSaveModal: UserSaveModalV1;
  @ViewChild('userDeleteModal') userDeleteModal: UserDeleteModalV1;


  selectedUser;
  query = this.defaultUsersQuery();

  constructor(
    private activatedRouter: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit(): void {
    this.initPage();
  }

  handleUserSaveModal(user: any = undefined): void {
    if (
      lodash.isUndefined(user)
    ) {
      this.showAddModal();
    } else {
      this.showEditModal(user);
    }
  }

  showEditModal(event): void {
    const USER_TMP: User = event.value;
    if (
      !USER_TMP
    ) {
      return;
    }
    const USER = {
      id: ramda.pathOr(DEFAULT_TABLE.USERS.FIELD._ID, ['id'], USER_TMP),
      username: ramda.pathOr(DEFAULT_TABLE.USERS.FIELD.USERNAME, ['username'], USER_TMP),
      password: '',
      deniedLoginAttempts: ramda.pathOr(0, ['deniedLoginAttempts'], USER_TMP),
      role: ramda.pathOr(DEFAULT_TABLE.USERS.FIELD.ROLE, ['role'], USER_TMP),
      timezone: ramda.pathOr(DEFAULT_TABLE.USERS.FIELD.TIMEZONE, ['timezone'], USER_TMP),
      accessGroupIds: ramda.pathOr([], ['accessGroupIds'], USER_TMP),
      tenants: ramda.pathOr([], ['tenants'], USER_TMP),
      userStatus: ramda.pathOr('notDefined', ['userStatus'], USER_TMP),
    };
    this.userSaveModal.showAsModal(USER);
  }

  showAddModal(): void {
    const USER = {
      id: DEFAULT_TABLE.USERS.FIELD._ID,
      username: DEFAULT_TABLE.USERS.FIELD.USERNAME,
      password: DEFAULT_TABLE.USERS.FIELD.PASSWORD,
      role: DEFAULT_TABLE.USERS.FIELD.ROLE,
      timezone: DEFAULT_TABLE.USERS.FIELD.TIMEZONE,
      tenants: DEFAULT_TABLE.USERS.FIELD.TENANTS,
    };
    this.userSaveModal.showAsModal(USER);
  }

  showDeleteModal(event): void {
    _debugX(UsersViewV1.getClassName(), `showDeleteModal`,
      {
        event,
      });
    this.userDeleteModal.show(event);
  }

  private initPage(): void {
    this.setPageNumberFromURL();
  }

  /** Used on init, refresh, enter the URL by link */
  private setPageNumberFromURL(): void {
    const PAGE = this.activatedRouter.snapshot.queryParamMap.get('page');
    this.query.pagination.page = parsePageNumberFromURL(PAGE);
  }

  private defaultUsersQuery() {
    const QUERY = defaultQuery();
    QUERY.sort.field = 'username';
    return QUERY;
  }

  static route() {
    const RET_VAL = {
      path: 'users',
      component: UsersViewV1,
      data: {
        name: 'users_view_v1.name',
        breadcrumb: 'users_view_v1.breadcrumb',
        description: 'users_view_v1.description',
        component: UsersViewV1.getClassName(),
        requiresApplicationPolicy: true,
        actions: [
          {
            name: 'users_view_v1.actions.change_tenants.name',
            component: 'users.view.change.tenants',
            description: 'users_view_v1.actions.change_tenants.description',
          },
          {
            name: 'users_view_v1.actions.change_access_group.name',
            component: 'users.view.change.accessGroup',
            description: 'users_view_v1.actions.change_access_group.description',
          },
          {
            name: 'users_view_v1.actions.add.name',
            component: 'users.view.add',
            description: 'users_view_v1.actions.add.description',
          },
          {
            name: 'users_view_v1.actions.edit.name',
            component: 'users.view.edit',
            description: 'users_view_v1.actions.edit.name',
          },
          {
            name: 'users_view_v1.actions.delete.name',
            component: 'users.view.delete',
            description: 'users_view_v1.actions.delete.description',
          },
        ]
      }
    };
    return RET_VAL;
  }

}

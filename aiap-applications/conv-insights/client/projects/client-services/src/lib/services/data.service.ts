/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import * as ramda from 'ramda';

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';


@Injectable()
export class DataService extends BaseServiceV1 {
  private expandSource = new BehaviorSubject<boolean>(false);
  currentExpandStatus = this.expandSource.asObservable();
  private isExpanded = true;
  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private http: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  toggleExpand(expand: boolean = this.isExpanded) {

    this.expandSource.next(this.isExpanded);
    this.isExpanded = !this.isExpanded

  }

  async getData(endpoint: string) {
    const opts = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.http.get(endpoint, opts).toPromise();
  }

  /** TODO replace all promise methods approach with observable: getDataNew-> getData */
  getDataNew(endpoint: string): Observable<any> {
    const opts = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.http.get(endpoint, opts);
  }

  /** TODO replace all promise methods approach with observable: putDataNew-> putData */
  putDataNew(endpoint: string, body: object): Observable<any> {
    const opts = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.http.put(endpoint, body, opts);
  }

  async postData(endpoint: string, body: object) {
    const opts = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.http.post(endpoint, body, opts).toPromise();
  }

  async putData(endpoint: string, body: object) {
    const opts = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.http.put(endpoint, body, opts).toPromise();
  }

  async getTones(from: any = null, to: any = null) {
    const url = `${this.environmentService.getEnvironment().hostUrl}api/v1/reports/tones?from=${from}&to=${to}`;
    return this.getData(url);
  }

  async deleteData(endpoint: string, body: object = null) {
    const opts = {
      headers: { ['Authorization']: `Bearer ${this._token()}` },
      body: body
    };
    return this.http.delete(endpoint, opts).toPromise();
  }

  async getUniqueUsers(from: any = null, to: any = null) {
    const url = `${this.environmentService.getEnvironment().hostUrl}api/v1/reports/users?from=${from}&to=${to}`;
    return this.getData(url);
  }

  async getUniqueUsersByCountry(from: any = null, to: any = null) {
    const url = `${this.environmentService.getEnvironment().hostUrl}api/v1/reports/uniqueusersbycountry?from=${from}&to=${to}`;
    return this.getData(url);
  }

  async getUsersCompany(from: any = null, to: any = null) {
    const url = `${this.environmentService.getEnvironment().hostUrl}api/v1/reports/usercompany?from=${from}&to=${to}`;
    return this.getData(url);
  }

  async getIntentsGraph(from: any = null, to: any = null, showSystemMessages: any = null) {
    const url = `${this.environmentService.getEnvironment().hostUrl}api/v1/reports/intents-tree-graph?from=${from}&to=${to}&system=${showSystemMessages}`;
    return this.getData(url);
  }

  async getAITests(
    from: any = null,
    to: any = null,
    skillId: any = null,
    testName: any = null,
    items: number = 1000,
    page: number = 1,
    field: string = 'started',
    sort: string = 'desc'
  ) {
    let url = `${this.environmentService.getEnvironment().hostUrl}api/v1/ai/tests?from=${from}&to=${to}&size=${items}&page=${page}&field=${field}&sort=${sort}`;
    if (skillId) {
      url = `${url}&skillId=${skillId}`;
    }
    if (testName) {
      url = `${url}&testName=${testName}`;
    }
    return this.getData(url);
  }

  async getAITestResult(id: string) {
    const url = `${this.environmentService.getEnvironment().hostUrl}api/v1/ai/tests/${id}`;
    return this.getData(url);
  }

  async deleteAITestResult(id: string) {
    const url = `${this.environmentService.getEnvironment().hostUrl}api/v1/ai/tests/${id}`;
    return this.deleteData(url);
  }

  // async addUser(item) {
  //   const url = `${this.environmentService.getEnvironment().hostUrl}api/v1/users`;
  //   return this.postData(url, item);
  // }

  // async editUser(item) {
  //   const url = `${this.environmentService.getEnvironment().hostUrl}api/v1/users/${item._id}`;
  //   return this.putData(url, item);
  // }

  // async deleteUser(item) {
  //   const url = `${this.environmentService.getEnvironment().hostUrl}api/v1/users/${item._id}`;
  //   return this.deleteData(url);
  // }

  async getConnections() {
    const url = `${this.environmentService.getEnvironment().hostUrl}api/v1/ai/services`;
    return await this.getData(url);
  }

  // <DEPRECATED
  getIntents(serviceId: any = 'default', skillName: string = '', skillId: any = '') {
    skillName = encodeURIComponent(skillName);
    skillId = encodeURIComponent(skillId);
    let url = `${this.environmentService.getEnvironment().hostUrl}api/v1/ai/${serviceId}/intents?skillName=${skillName}&skillId=${skillId}`;
    return this.http.get(url, this.getAuthHeaders());
  }
  //>

  retrieveIntents(serviceId = 'default', skillId: any = '') {
    serviceId = encodeURIComponent(serviceId);
    skillId = encodeURIComponent(skillId);
    let url = `${this.environmentService.getEnvironment().hostUrl}api/v1/ai/services/${serviceId}/skills/${skillId}/intents`;
    return this.http.get(url, this.getAuthHeaders());
  }

  addWAServiceTest(item) {
    const REQUEST_URL = `${this.environmentService.getEnvironment().hostUrl}api/v1/ai/tests`;
    const REQUEST_BODY = {
      params: JSON.stringify(item).toString()
    };
    return this.http.post(REQUEST_URL, REQUEST_BODY, this.getAuthHeaders());
  }

  uploadTestFile(file: File, item) {
    const REQUEST_URL = `${this.environmentService.getEnvironment().hostUrl}api/v1/ai/tests/upload`;
    const REQUEST_BODY: FormData = new FormData();

    REQUEST_BODY.set('csv', file);
    REQUEST_BODY.set('params', JSON.stringify(item));
    return this.http.post(REQUEST_URL, REQUEST_BODY, this.getAuthHeaders());
  }

  async getEntities(serviceId: any = 'watson') {
    const url = `${this.environmentService.getEnvironment().hostUrl}api/v1/ai/${serviceId}/entities`;
    return await this.getData(url);
  }

  updateIntent(
    serviceId: any = 'default',
    skillName: string = '',
    skillId: any = '',
    intentId: any = null,
    utterance: any = null,
    messageId: any = null
  ) {
    const url = `${this.environmentService.getEnvironment().hostUrl}api/v1/ai/${serviceId}/intents/${intentId}/example`;
    return this.http.post(url, { text: utterance, messageId: messageId, skillName: skillName, skillId: skillId }, this.getAuthHeaders());
  }


  async getChannelConversations(from: any = null, to: any = null) {
    const url = `${this.environmentService.getEnvironment().hostUrl}api/v1/reports/channels?from=${from}&to=${to}`;
    return this.getData(url);
  }

  async getWorkspaceMessages(from: any = null, to: any = null) {
    const url = `${this.environmentService.getEnvironment().hostUrl}api/v1/reports/workspaces?from=${from}&to=${to}`;
    return this.getData(url);
  }

  async getEngagements(items: number = 10, page: number = 1) {
    const url = `${this.environmentService.getEnvironment().hostUrl}api/v1/engagements?&size=${items}&page=${page}`;
    return this.getData(url);
  }

  async getEngagement(id) {
    const url = `${this.environmentService.getEnvironment().hostUrl}api/v1/engagements/${id}`;
    return this.getData(url);
  }

  async addEngagement(id) {
    const url = `${this.environmentService.getEnvironment().hostUrl}api/v1/engagements/${id}`;
    return this.postData(url, {});
  }

  async deleteEngagement(id) {
    const url = `${this.environmentService.getEnvironment().hostUrl}api/v1/engagements/${id}`;
    return this.deleteData(url);
  }

  async editEngagement(id: any = null, body: any = null) {
    const url = `${this.environmentService.getEnvironment().hostUrl}api/v1/engagements/${id}`;
    body.widget.host = window.location.host;
    return this.putData(url, body);
  }

  async getUsersCountry(from: any = null, to: any = null) {
    const url = `${this.environmentService.getEnvironment().hostUrl}api/v1/reports/usercountry?from=${from}&to=${to}`;
    return this.getData(url);
  }

  async getActionsCount(from: any = null, to: any = null) {
    const url = `${this.environmentService.getEnvironment().hostUrl}api/v1/reports/actionscount?from=${from}&to=${to}`;
    return this.getData(url);
  }

}

/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigServiceV2, StorageServiceV2 } from '.';
import { ChatWidgetServiceV1 } from '.';

@Injectable()
export class DataServiceV2 {

  static getClassName() {
    return 'DataServiceV2';
  }

  private options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private blobOptions = {
    observe: 'response',
    responseType: 'blob'
  };

  constructor(
    private http: HttpClient,
    private config: ConfigServiceV2,
    private storageService: StorageServiceV2,
    private chatWidgetService: ChatWidgetServiceV1,
  ) { }

  async postData(endpoint: string, body: object) {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post(endpoint, body, options).toPromise();
  }

  getAuthHeaders() {
    const TOKEN = this.storageService.getConversationToken();
    const RET_VAL = {
      headers: { ['Authorization']: `Bearer ${TOKEN}` }
    };
    return RET_VAL;
  }

  getData(endpoint: string) {
    return this.http.get(endpoint, this.options).toPromise();
  }

  getBlob(endpoint: string) {
    return this.http.get(endpoint, { responseType: 'blob' }).toPromise();
  }

  postBlob(endpoint: string, body: object) {
    return this.http.post(endpoint, body, { responseType: 'blob' });
  }

  postSurvey(body) {
    const url = `${this._getHostUrl()}api/v1/surveys`;
    return this.saveData(url, body);
  }

  postFeedback(body) {
    const url = `${this._getHostUrl()}api/v1/feedbacks`;
    return this.saveData(url, body);
  }

  async postEnvironment(conversationToken: any) {
    const url = `${this._getHostUrl()}api/v1/environments`;
    return await this.postData(url, {
      conversationToken: conversationToken,
      environment: this.config.getEnvironment()
    });
  }

  retrieveInputTextSuggestions(body) {
    const url = `${this._getHostUrl()}api/v1/suggestions/find-many-by-model-id-and-text`;
    const REQUEST_HEADERS = this.getAuthHeaders();
    return this.http.post(url, body, REQUEST_HEADERS);
  }

  async verifyJwt(token: any) {
    const url = `${this._getHostUrl()}api/v1/verify`;
    return await this.postData(url, { jwt: token });
  }

  transformTranscript(body) {
    const url = `${this._getHostUrl()}api/v1/transcripts/transform/test-case`;
    return this.http.post(url, body);
  }

  downloadTranscript(body: object) {
    const URL = `${this._getHostUrl()}api/v1/transcripts/download-one`;
    return this.postBlob(URL, body);
  }

  notifyEvent(endpoint: string, body: object) {
    return this.http.get(endpoint, body);
  }

  /** TODO replace all promise methods approach with observable  */
  saveData(endpoint: string, body: object) {
    return this.http.post(endpoint, body, this.options);
  }

  _getHostUrl() {
    const RET_VAL = this.chatWidgetService.getChatAppHost() + '/';
    return RET_VAL;
  }
}

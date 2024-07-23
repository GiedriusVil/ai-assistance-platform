import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import * as ramda from 'ramda';

import { _debugX } from "client-utils";

@Injectable()
export class CustomTranslateLoader implements TranslateLoader {

  contentHeader = new HttpHeaders({ "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });

  constructor(
    private http: HttpClient,
  ) { }

  static getClassName() {
    return 'CustomTranslateLoader'
  }

  getTranslation(lang: string): Observable<any> {

    const HOST_URL = ramda.path(['acaWidgetOptions', 'chatAppHost'], window);

    let apiAddress = HOST_URL + "/wbc-chat-app/en-US/assets/i18n/" + lang + ".json";

    return new Observable<any>(observer => {
      this.http.get(apiAddress, { headers: this.contentHeader }).subscribe((res: any) => {
        observer.next(res);
        observer.complete();
      },
        error => {
          _debugX(CustomTranslateLoader.getClassName(), '->', { error });
          observer.next();
          observer.complete();
        }
      );
    });
  }
}

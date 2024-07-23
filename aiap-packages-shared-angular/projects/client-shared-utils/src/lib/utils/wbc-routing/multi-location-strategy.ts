/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Inject, Injectable, Optional } from '@angular/core';
import { LocationStrategy, Location, PlatformLocation, APP_BASE_HREF, LocationChangeListener, PathLocationStrategy } from '@angular/common';

import {
  _debugX,
  _errorX,
} from '../../loggers';

// TODO: Fix location change on navigation arrow click, increased navigationId and routing depth > 1
@Injectable()
export class MultiLocationStrategy extends LocationStrategy {

  static getClassName() {
    return 'MultiLocationStrategy';
  }

  private _baseHref: string;

  constructor(
    private _platformLocation: PlatformLocation,
    @Optional() @Inject(APP_BASE_HREF) href?: string
  ) {
    super();
    if (href == null) {
      href = this._platformLocation.getBaseHrefFromDOM();
    }
    if (href == null) {
      throw new Error(`No base href set. Please provide a value for the APP_BASE_HREF token or add a base element to the document.`);
    }
    this._baseHref = href;
  }

  onPopState(fn: LocationChangeListener): void {
    this._platformLocation.onPopState(fn);
    this._platformLocation.onHashChange(fn);
  }

  getState() { }

  getBaseHref(): string {
    return this._baseHref;
  }

  prepareExternalUrl(internal: string, state?: any): string {
    const RET_VAL = this.checkPathAndInternal(this.path(), internal, state);
    return RET_VAL;
  }

  checkPathAndInternal(path: string, internal: string, state: any): string {
    const openParenthesisIndex = internal.indexOf('(');
    const closedParenthesisIndex = internal.indexOf(')', openParenthesisIndex);
    const outlet = internal.substring(openParenthesisIndex, closedParenthesisIndex + 1);
    const queryParams = internal.split('?')[1];
    let retVal;
    //Get navigationId from RouterState
    let navId = 0;
    if (state) {
      navId = state.navigationId;
    }

    // add internal route to base href
    if (path.startsWith('/') && path.length === 1) {
      retVal = internal;
      return retVal;
    }

    if (path.includes('(')) {
      //There's an outlet in the path => remove if necessary or on initial navigation
      const url = (navId === -1 || navId === 1) ? path : path.replace(/ *\([^)]*\) */g, outlet);
      retVal = this._checkQueryParams(url, queryParams);
      return retVal;
    }

    if (path === internal || outlet.length < 1) {
      //don't append to prevent dublicated path e.g. /foo/foo
      retVal = path;
      return retVal;
    } else {
      // append internal url to path
      retVal = path + outlet;
      return retVal;
    }
  }

  private _checkQueryParams(url: string, queryParams: string) {
    _debugX(MultiLocationStrategy.getClassName(), '_checkQueryParams', { url, queryParams });
    let retVal = url;
    const URL_WITHOUT_OLD_QUERY = url.split('?')[0];
    if (
      url &&
      queryParams &&
      !queryParams.includes('query')
    ) {
      retVal = URL_WITHOUT_OLD_QUERY + `?${queryParams}`;
    }
    return retVal;
  }

  path(includeHash: boolean = false): string {
    let platformLocationSearch;
    let normalizedQueryParams;
    let pathname;
    let hash;
    let retVal;
    try {
      platformLocationSearch = this._platformLocation.search;
      normalizedQueryParams = Location.normalizeQueryParams(platformLocationSearch)
      pathname = this._platformLocation.pathname + normalizedQueryParams;
      hash = this._platformLocation.hash;
      _debugX(MultiLocationStrategy.getClassName(), 'path', { platformLocationSearch, normalizedQueryParams, pathname, hash });
      retVal = hash && includeHash ? `${pathname}${hash}` : pathname;
      return retVal;
    } catch (error) {
      _errorX(MultiLocationStrategy.getClassName(), 'path', { error, platformLocationSearch, normalizedQueryParams, pathname, hash });
      throw error;
    }
  }

  pushState(state: any, title: string, url: string, queryParams: string) {
    const externalUrl = this.prepareExternalUrl(url + Location.normalizeQueryParams(queryParams), state);
    _debugX(MultiLocationStrategy.getClassName(), 'pushState', { state, title, url, externalUrl, queryParams });
    this._platformLocation.pushState(state, title, externalUrl);
  }

  replaceState(state: any, title: string, url: string, queryParams: string) {
    const externalUrl = this.prepareExternalUrl(url + Location.normalizeQueryParams(queryParams), state);
    _debugX(MultiLocationStrategy.getClassName(), 'replaceState', { state, title, url, externalUrl, queryParams });
    this._platformLocation.replaceState(state, title, externalUrl);
  }

  forward(): void {
    this._platformLocation.forward();
  }

  back(): void {
    this._platformLocation.back();
  }

}

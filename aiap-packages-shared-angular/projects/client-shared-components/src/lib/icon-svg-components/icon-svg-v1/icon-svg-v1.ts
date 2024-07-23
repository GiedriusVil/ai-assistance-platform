/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map, shareReplay, tap } from 'rxjs';

@Component({
  selector: 'aiap-icon-svg-v1',
  templateUrl: './icon-svg-v1.html',
  styleUrls: ['./icon-svg-v1.scss'],
})
export class IconSvgV1 implements OnInit, OnChanges {

  @Input() public src = '';

  constructor(
    private el: ElementRef,
    private http: HttpClient,
  ) { }

  private static cache: {
    [key: string]: Observable<any>
  } = {};

  ngOnInit(): void {
    if (!(this.src in IconSvgV1.cache)) {
      IconSvgV1.cache[this.src] = this.http.get(this.src, { responseType: 'text' }).pipe(shareReplay(1));
    }
    IconSvgV1.cache[this.src].subscribe(val => this.el.nativeElement.innerHTML = val)
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.http.get(this.src, { responseType: 'text' }).subscribe(svg => {
      this.el.nativeElement.innerHTML = svg;
    });
  }
}

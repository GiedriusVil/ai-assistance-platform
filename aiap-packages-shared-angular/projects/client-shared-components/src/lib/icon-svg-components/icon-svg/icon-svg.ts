/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'icon-svg',
  templateUrl: './icon-svg.html',
  styleUrls: ['./icon-svg.scss'],
})
export class IconSvg implements OnInit {

  @Input() public src = '';

  constructor(
    private el: ElementRef,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.http.get(this.src, { responseType: 'text' }).subscribe(response => {
      const TRIMMED_RESPONSE = response.trim();
      if (TRIMMED_RESPONSE.startsWith('<svg')) {
        this.el.nativeElement.innerHTML = TRIMMED_RESPONSE;
      }
    });
  }
}

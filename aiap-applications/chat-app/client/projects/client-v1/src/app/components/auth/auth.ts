import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    window.addEventListener('message', async event => {
      if (event.data) {
        if (event.data.type && event.data.type === 'acaWidgetCloseButtonPressed') {
          setTimeout(() => {
            // SAST_FIX ['postMessage']
            parent['postMessage']({ type: 'closeChatWidget' }, '*');
          }, 0);
        }
      }
    });
  }
}

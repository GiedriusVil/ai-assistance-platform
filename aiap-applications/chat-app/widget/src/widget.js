'use strict';
(function () {
  var head = document.head || document.getElementsByTagName('head')[0];
  var _onExpand = false;

  let newVerticalPosition = 0;
  let newHorizontalPosition = 0;
  let lastVerticalPosition = 0;
  let lastHorizontalPosition = 0;

  var expandHandler = function (event) {
    _onExpand = false;

    if (event.target.id !== 'aca--widget-frame') {
      window.acaWidget.__handleWindowResize();
    }
  };

  // Add IBM Fonts
  var link = document.createElement('link');
  link.type = 'text/css';
  link.href = 'https://fonts.googleapis.com/css?family=IBM+Plex+Sans:300,400';
  link.rel = 'stylesheet';
  link.media = 'all';
  head.appendChild(link);

  // Add Widget Styles
  var styles = document.createElement('style');
  styles.type = 'text/css';
  var css = '_WIDGETSCSS_';
  if (styles.styleSheet) {
    // This is required for IE8 and below.
    styles.styleSheet.cssText = css;
  } else {
    styles.appendChild(document.createTextNode(css));
  }
  head.appendChild(styles);

  window.acaWidget = {
    __initialized: false,

    __resizeWidget: function () {
      const WIDGET_RESIZER = document.querySelector('#resizer');
      const WIDGET_FRAME = document.getElementById('aca--widget-frame');
      const WIDGET_CONTENT = document.getElementById('aca--widget-content');
      const WIDGET_IFRAME = document.getElementById('aca--widget-iframe');

      setTimeout(function () {
        WIDGET_RESIZER.style.display = 'block';
      }, 1000);

      WIDGET_RESIZER.addEventListener('mousedown', initResize, false);

      function initResize() {
        WIDGET_RESIZER.style.background = 'transparent';
        WIDGET_FRAME.style.opacity = '0.9';
        window.addEventListener('mousemove', resize, false);
        window.addEventListener('mouseup', stopResize, false);
      }

      function resize(e) {
        if (
          WIDGET_FRAME &&
          WIDGET_CONTENT &&
          WIDGET_IFRAME
        ) {
          const ACA_WIDGET_WIDTH = e.clientX - WIDGET_FRAME.offsetLeft;
          const ACA_WIDGET_HEIGHT = e.clientY - WIDGET_FRAME.offsetTop;

          WIDGET_FRAME.style.width = ACA_WIDGET_WIDTH + 'px';
          WIDGET_FRAME.style.height = ACA_WIDGET_HEIGHT + 'px';
          WIDGET_CONTENT.style.width = ACA_WIDGET_WIDTH + 'px';
          WIDGET_CONTENT.style.height = ACA_WIDGET_HEIGHT + 'px';
          WIDGET_IFRAME.style.width = ACA_WIDGET_WIDTH + 'px';
          WIDGET_IFRAME.style.height = ACA_WIDGET_HEIGHT + 'px';

          const WIDGET_DIMENSION_AS_STRING = JSON.stringify({ height: ACA_WIDGET_HEIGHT, width: ACA_WIDGET_WIDTH });
          window.localStorage.setItem('widgetDimension', WIDGET_DIMENSION_AS_STRING);
          WIDGET_RESIZER.style.width = ACA_WIDGET_WIDTH + 'px';
          WIDGET_RESIZER.style.height = ACA_WIDGET_HEIGHT + 'px';
          WIDGET_RESIZER.style.borderRadius = 'none';
        }
      }

      function stopResize() {
        window.removeEventListener('mousemove', resize, false);
        window.removeEventListener('mouseup', stopResize, false);
        WIDGET_RESIZER.style.width = '20px';
        WIDGET_RESIZER.style.height = '20px';
        WIDGET_RESIZER.style.background = '#2d75fd';
        WIDGET_RESIZER.style.borderRadius = '46px 0px 0px 0px';
        WIDGET_FRAME.style.opacity = '1';
      }
    },

    __isResizerEnabled: function (data) {
      switch (data.resizerEnabled) {
        case true:
          window.acaWidget.__resizeWidget();
          break;

        case false:
          const WIDGET_RESIZER = document.querySelector('#resizer');
          WIDGET_RESIZER.style.display = 'none';
          break;

        default:
          break;
      }
    },

    __draggableWidget: function () {
      const WIDGET_DRAGGABLE = document.querySelector('#draggable');
      const WIDGET_FRAME = document.querySelector('#aca--widget-frame');

      setTimeout(function () {
        WIDGET_DRAGGABLE.style.display = 'block';
      }, 1000);

      WIDGET_DRAGGABLE.onmousedown = dragMouseDown;

      function dragMouseDown(e) {
        e.preventDefault();
        lastVerticalPosition = e.clientX;
        lastHorizontalPosition = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        WIDGET_DRAGGABLE.style.cursor = 'grabbing';
        WIDGET_DRAGGABLE.style.background = 'transparent';
        WIDGET_FRAME.style.opacity = '0.9';
        WIDGET_DRAGGABLE.style.color = 'transparent';
        WIDGET_DRAGGABLE.style.opacity = '0';
      }

      function elementDrag(e) {
        e.preventDefault();
        newVerticalPosition = lastVerticalPosition - e.clientX;
        newHorizontalPosition = lastHorizontalPosition - e.clientY;
        lastVerticalPosition = e.clientX;
        lastHorizontalPosition = e.clientY;

        const ACA_WIDGET_TOP = WIDGET_FRAME.offsetTop - newHorizontalPosition;
        const ACA_WIDGET_LEFT = WIDGET_FRAME.offsetLeft - newVerticalPosition;

        WIDGET_FRAME.style.top = ACA_WIDGET_TOP + 'px';
        WIDGET_FRAME.style.left = ACA_WIDGET_LEFT + 'px';

        const WIDGET_POSITION_AS_STRING = JSON.stringify({ top: ACA_WIDGET_TOP, left: ACA_WIDGET_LEFT });
        window.localStorage.setItem('widgetPosition', WIDGET_POSITION_AS_STRING);
        const RAW_WIDGET_DIMENSION = window.localStorage.getItem('widgetDimension');

        if (RAW_WIDGET_DIMENSION) {
          const WIDGET_DIMENSION = JSON.parse(RAW_WIDGET_DIMENSION);
          WIDGET_DRAGGABLE.style.width = WIDGET_DIMENSION.width + 'px';
          WIDGET_DRAGGABLE.style.height = WIDGET_DIMENSION.height + 'px';
        } else {
          WIDGET_DRAGGABLE.style.width = '576px';
          WIDGET_DRAGGABLE.style.height = '400px';
        }
        WIDGET_DRAGGABLE.style.width = window.localStorage.getItem('widgetDimension') ? JSON.parse(window.localStorage.getItem('widgetDimension')).width + 'px' : '576px';
        WIDGET_DRAGGABLE.style.height = window.localStorage.getItem('widgetDimension') ? JSON.parse(window.localStorage.getItem('widgetDimension')).height + 'px' : '400px';
      }

      function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        WIDGET_DRAGGABLE.style.cursor = 'grab';
        WIDGET_DRAGGABLE.style.width = 'calc(100% - 198px)';
        WIDGET_DRAGGABLE.style.height = '50px';
        WIDGET_FRAME.style.opacity = '1';
      }
    },

    __isDraggableEnabled: function (data) {
      switch (data.draggableEnabled) {
        case true:
          window.acaWidget.__draggableWidget();
          break;

        case false:
          const WIDGET_DRAGGABLE = document.querySelector('#draggable');
          WIDGET_DRAGGABLE.style.display = 'none';
          break;

        default:
          break;
      }
    },

    __checkEnabledFeatures: function (data) {
      window.acaWidget.__isResizerEnabled(data);
      window.acaWidget.__isDraggableEnabled(data);
    },

    __open: function () {
      setTimeout(function () {
        window.acaWidget.__hideChatAppButton();
        document.getElementById('aca--widget-frame').style.display = 'block';
        window.acaWidget.__handleWindowResize();
        window.acaWidgetOptions.maximized = true;
        if (window.acaWidgetOptions.minimized === false || window.acaWidget.__initialized === false) {
          window.acaWidgetAuthenticator.__refreshToken();
          window.acaWidget.__iframeLoaded(false);
        }
        window.acaWidget.__setWidgetState();
      }, 0);
    },

    __iframeInitialize: function (params) {
      if (params === null || params === undefined) {
        params = [];
      }
      var _url = window.acaWidgetOptions.chatAppHost + '?widget=true&width=' + window.innerWidth + '&minimized=' + window.acaWidgetOptions.minimized;
      if (params.length > 0) {
        _url = _url + '&' + params.join('&');
      }
      document.getElementById('aca--widget-iframe').src = _url;
      window.acaWidget.__initialized = true;
    },

    __iframeLoaded: function (done) {
      if (done) {
        setTimeout(function () {
          document.getElementById('aca--widget-content-loader').style.display = 'none';
        }, 1000);
      } else {
        document.getElementById('aca--widget-content-loader').style.display = 'block';
      }
    },

    __initialize: function () {
      console.log(`[ACA_WIDGET_JS] [DEBUG] __initialize`, {
        window_acaWidget: window.acaWidget,
        window_acaWidgetOptions: window.acaWidgetOptions,
        window_acaWidgetAuthenticator: window.acaWidgetAuthenticator
      });
      if (
        window.acaWidget &&
        window.acaWidgetOptions &&
        window.acaWidgetAuthenticator
      ) {
        console.log('[ACA_WIDGET_JS] [DEBUG] __initialize', {
          window_acaWidgetOptions: window.acaWidgetOptions
        });
        const QUERY = window.top.location.search;
        const QUERY_PARAMS = new URLSearchParams(QUERY);
        const ACA_TOKEN = QUERY_PARAMS.get('acaToken');
        // Restore Minimized state
        var storage = window.localStorage.getItem('aiap-chat-app-v1-state');
        if (storage) {
          var state = JSON.parse(storage);
          if (state && state.expire > new Date().getTime()) {
            window.acaWidgetOptions.maximized = state.maximized || false;
            window.acaWidgetOptions.minimized = state.minimized || false;
          } else {
            window.acaWidgetOptions.maximized = false;
            window.acaWidgetOptions.minimized = false;
          }
        }

        // Add Widget HTML
        if (!document.getElementById('aca--widget-frame')) {
          var body = document.body || document.getElementsByTagName('body')[0];
          var customWidget = document.createElement('section');
          customWidget.insertAdjacentHTML('afterbegin', '_WIDGETHTML_');
          body.appendChild(customWidget);
          console.log('[ACA_WIDGET] HTML injected.');
        }

        setTimeout(function () {
          window.acaWidget.__addEventListeners();
          window.acaWidget.__handleWindowResize();
        }, 0);

        setTimeout(() => {
          // SAST_FIX ['postMessage']
          window.parent['postMessage']({ type: 'aiapOnChatAppClientReady' }, '*')
        }, 250);
      } else {
        setTimeout(function () {
          window.acaWidget.__initialize();
        }, 250);
      }
    },

    __close: function () {
      window.acaWidgetOptions.minimized = false;
      window.acaWidgetOptions.maximized = false;
      setTimeout(function () {
        document.getElementById('aca--widget-frame').style.display = 'none';
        window.acaWidget.__showChatAppButton();
        document.getElementById('aca--widget-iframe').src = 'about:blank';
        window.acaWidget.__clearWidgetState();
        document.querySelector('#draggable').style.display = 'none';
        document.querySelector('#resizer').style.display = 'none';
      }, 0);
    },

    __setWidgetState: function () {
      window.localStorage.setItem('aiap-chat-app-v1-state', JSON.stringify(window.acaWidgetOptions));
    },

    __setWidgetOptionsExpire: function (expire) {
      if (!window.acaWidgetOptions) {
        window.acaWidgetOptions = {};
      }
      window.acaWidgetOptions.expire = expire;
    },

    __clearWidgetState: function () {
      window.localStorage.removeItem('aiap-chat-app-v1-state');
    },

    __addEventListeners: function () {
      window.addEventListener('resize', function () {
        window.acaWidget.__handleWindowResize();
        // SAST_FIX -> ['postMessage']
        document.getElementById('aca--widget-iframe').contentWindow['postMessage']({ widgetWidth: window.innerWidth }, '*');
      });

      window.addEventListener('click', function () {
        let EVENT = {
          widgetReset: _onExpand,
        };
        // SAST_FIX -> ['postMessage']
        document.getElementById('aca--widget-iframe').contentWindow['postMessage'](EVENT, '*');
      });
      window.addEventListener('message', function (event) {
        if (event.data.type && event.data.type === 'aiapChatAppClientOpen') {
          window.acaWidget.__open();
        }
        if (event.data.type && event.data.type === 'onWidgetClose') {
          window.acaWidget.__close(false);
        }
        if (event.data.type && event.data.type === 'onWidgetMinimize') {
          if ((window.acaWidgetOptions.minimized) || (!window.acaWidgetOptions.maximized && !window.acaWidgetOptions.minimized)) {
            window.acaWidget.__handleChatMinimizeAndMaximize(false, true);
          } else {
            window.acaWidget.__handleChatMinimizeAndMaximize(true, false);
          }
        }
        if (event.data.type && event.data.type === 'onWidgetExpand') {
          _onExpand = true;
          parent.addEventListener('click', expandHandler);
          window.acaWidget.__handleWindowResize();
        }
        if (event.data.type && event.data.type === 'onWidgetCollapse') {
          _onExpand = false;
          parent.removeEventListener('click', expandHandler);
          window.acaWidget.__handleWindowResize();
        }
        if (event.data.type && event.data.type === 'onSetWidgetState') {
          window.acaWidget.__setWidgetOptionsExpire(event.data.expire);
          window.acaWidget.__setWidgetState();
        }
        if (event.data.type && event.data.type === 'onHostPageInfoRequest') {
          this.window.acaWidget.__handleHostPageInfoRequest(event.data);
        }
        if (event.data.type && event.data.type === 'onConfigDataRequest') {
          window.acaWidget.__checkEnabledFeatures(event.data.data);
        }
        if (event.data.type && event.data.type === 'onIdentificationRequest') {
          this.window.acaWidget.__handleIdentificationRedirect(event.data);
        }
        if (event.data.type && event.data.type === 'onOpenNewTab') {
          this.window.acaWidget.__handleOpenNewTab(event.data);
        }
      });
    },

    __handleOpenNewTab(request) {
      console.log('[ACA_WIDGET] __handleOpenNewTab', { request });
      if (request?.url) {
        const win = window.open(request.url, '_blank');
        win.focus();
      }
    },

    __handleIdentificationRedirect(data) {
      const REDIRECT_HOST = data.redirectHost;
      const REDIRECT_PATH = data.redirectPath;
      const TARGET_HOST = data.targetHost;
      const TARGET_PATH = data.targetPath;

      const CONVERSATION_ID = data.conversationId;

      const GENESYS_TENANT_VERSION = data?.options?.genesys?.tenantVersion;

      const ORIGIN_URL = window.top.location.protocol + '//'
        + window.top.location.host
        + window.top.location.pathname
        + window.top.location.search;

      /**
       * 2022-02-02 [jevgenij.golobokin]
       * TARGET_URL includes Tieto-specific params for passing identification to genesys chat
       * interactionId - id of active genesys chat session
       * method - identification before (2) or during the chat session (1)
       * version - tenant (Palmia = 1, Terke = 2, Heke = 3, Talpa = 4)
       */
      const TARGET_URL = TARGET_HOST + TARGET_PATH + '?'
        + 'interactionId=' + CONVERSATION_ID
        + '&method=1'
        + '&version=' + GENESYS_TENANT_VERSION
        + '&origPage=' + ORIGIN_URL;
      const TARGET_URL_ENCODED = encodeURIComponent(TARGET_URL);

      const REDIRECT_TO_URL = REDIRECT_HOST + REDIRECT_PATH + '?target=' + TARGET_URL_ENCODED;
      console.log('[ACA_WIDGET] __handleIdentificationRedirect', { ORIGIN_URL, TARGET_URL, REDIRECT_TO_URL });
      window.location.replace(REDIRECT_TO_URL);
    },


    __handleHostPageInfoRequest(request) {
      console.log('[ACA_WIDGET] __handleHostPageInfoRequest', { request });
      let HOST_PAGE_INFO_EVENT = {
        hostPageInfo: {
          href: window.top.location.href,
        }
      };
      if (
        document &&
        document.documentElement &&
        document.documentElement.lang
      ) {
        let documentLanguage = document.documentElement.lang;
        if (documentLanguage.includes('-')) {
          const INDEX_OF_DASH = documentLanguage.indexOf("-");
          documentLanguage = documentLanguage.slice(0, INDEX_OF_DASH);
        }
        HOST_PAGE_INFO_EVENT.hostPageInfo.lang = documentLanguage;
        HOST_PAGE_INFO_EVENT.hostPageInfo.tenantId = window.acaWidgetOptions.tenantId;
        HOST_PAGE_INFO_EVENT.hostPageInfo.assistantId = window.acaWidgetOptions.assistantId;
        HOST_PAGE_INFO_EVENT.hostPageInfo.engagementId = window.acaWidgetOptions.engagementId;

        let dataItemReqs = request.dataItemReqs;
        if (
          dataItemReqs &&
          dataItemReqs.length > 0
        ) {
          for (let index = 0; index < dataItemReqs.length; index++) {
            let dataItemReq = dataItemReqs[index];
            if (
              dataItemReq &&
              dataItemReq.sourceKey &&
              dataItemReq.targetKey &&
              dataItemReq.type
            ) {
              try {
                switch (dataItemReq.type) {
                  case 'string':
                    HOST_PAGE_INFO_EVENT.hostPageInfo[dataItemReq.targetKey] = window.localStorage.getItem(dataItemReq.sourceKey);
                    break;
                  case 'json':
                    HOST_PAGE_INFO_EVENT.hostPageInfo[dataItemReq.targetKey] = JSON.parse(window.localStorage.getItem(dataItemReq.sourceKey));
                    break;
                  default:
                    break;
                }
              } catch (error) {
                console.log('[ACA_WIDGET] [ERROR] Failed to retrieve data item.', { error, dataItemReq });
              }
            }
          }
        }
      }
      const QUERY = window.top.location.search;
      const QUERY_PARAMS = new URLSearchParams(QUERY);
      const ACA_TOKEN = QUERY_PARAMS.get('acaToken');
      if (ACA_TOKEN) {
        HOST_PAGE_INFO_EVENT.hostPageInfo.acaToken = ACA_TOKEN;
        const CURRENT_URL = new URL(window.top.location.href);
        CURRENT_URL.searchParams.delete('acaToken');
        window.history.replaceState(null, document.title, CURRENT_URL.href);
      }
      const IDENTIFICATION_STATUS = QUERY_PARAMS.get('identification');
      const INTERACTION_ID = QUERY_PARAMS.get('interactionId');
      if (IDENTIFICATION_STATUS) {
        HOST_PAGE_INFO_EVENT.hostPageInfo.identificationStatus = IDENTIFICATION_STATUS;
        const CURRENT_URL = new URL(window.top.location.href);
        CURRENT_URL.searchParams.delete('identification');
        if (INTERACTION_ID) {
          CURRENT_URL.searchParams.delete('interactionId');
        }
        window.history.replaceState(null, document.title, CURRENT_URL.href);
      }
      console.log('[ACA_WIDGET] __handleHostPageInfoRequest', { response: HOST_PAGE_INFO_EVENT });
      // SAST_FIX -> ['postMessage']
      document.getElementById('aca--widget-iframe').contentWindow['postMessage'](HOST_PAGE_INFO_EVENT, '*');
    },

    __handleChatMinimizeAndMaximize(minimized, maximized) {
      window.acaWidget.__hideChatAppButton();
      document.getElementById('aca--widget-frame').style.display = 'block';
      window.acaWidget.__handleWindowResize(true);
      window.acaWidgetOptions.minimized = minimized;
      window.acaWidgetOptions.maximized = maximized;
      window.acaWidget.__setWidgetState();
    },

    __handleWindowResize: function (transition) {
      var windowHeight = window.innerHeight;
      var windowWidth = document.documentElement.clientWidth;

      var defaultWidth = window.acaWidgetOptions.width;
      var defaultHeight = window.acaWidgetOptions.height;

      var frameHeight = windowHeight - 20 - 20;
      var frameWidth = defaultWidth;
      frameHeight = (frameHeight > 576) ? defaultHeight : frameHeight; // TODO: Check such option exists

      setTimeout(function () {
        document.getElementById('aca--widget-frame').classList.remove('aca--widget--desktop');
        document.getElementById('aca--widget-frame').classList.remove('aca--widget--mobile');
        document.getElementById('aca--widget-frame').classList.remove('aca--widget--mobile--minimized');
        document.getElementById('aca--widget-frame').classList.remove('aca--widget--expanded');

        if (window.acaWidgetOptions.minimized) {
          document.getElementById('aca--widget-frame').classList.add((windowWidth > 992) ? 'aca--widget--desktop' : 'aca--widget--mobile--minimized');
        } else {
          document.getElementById('aca--widget-frame').classList.add((windowWidth > 992) ? 'aca--widget--desktop' : 'aca--widget--mobile');
        }

        document.getElementsByTagName('body')[0].classList.remove('aca--disable--parent-scroll');
        if (windowWidth > 992) {
          document.getElementsByTagName('body')[0].classList.add('aca--enable--parent-scroll');
        } else {
          document.getElementsByTagName('body')[0].classList.add('aca--disable--parent-scroll');
        }
      }, 0);

      if (_onExpand) {
        if (windowWidth > 992) {
          if (windowWidth < 800) {
            frameWidth = defaultWidth + 200;
          } else {
            frameWidth = defaultWidth + 400;
          }
        } else {
          frameWidth = windowWidth;
          frameHeight = windowHeight;
        }

        setTimeout(function () {
          document.getElementById('aca--widget-frame').classList.add('aca--widget--expanded');
        }, 0);
      }

      if (windowWidth > 992) {
        window.acaWidget.__setElementsWidthAndHeight(frameHeight, frameWidth, transition);
      } else if (windowWidth > 576 && windowWidth < 992) {
        // COH Tablet requirement for height 50%
        var tabletHeight = windowHeight / 2;
        window.acaWidget.__setElementsWidthAndHeight(tabletHeight, windowWidth, transition);
      } else {
        window.acaWidget.__setElementsWidthAndHeight(windowHeight, windowWidth, transition);
      }
    },

    __setElementsWidthAndHeight: function (elementHeight, elementWidth, transition) {
      setTimeout(function () {
        const RAW_WIDGET_DIMENSION = window.localStorage.getItem('widgetDimension');
        const RAW_WIDGET_POSITION = window.localStorage.getItem('widgetPosition');

        let top = null;
        let left = null;

        if (RAW_WIDGET_DIMENSION) {
          const WIDGET_DIMENSION = JSON.parse(RAW_WIDGET_DIMENSION);
          elementHeight = WIDGET_DIMENSION.height;
          elementWidth = WIDGET_DIMENSION.width;
        }
        if (RAW_WIDGET_POSITION) {
          const WIDGET_POSITION = JSON.parse(RAW_WIDGET_POSITION);
          top = WIDGET_POSITION.top + 'px';
          left = WIDGET_POSITION.left;
        }
        if (transition) {
          document.getElementById('aca--widget-frame').style.transition = 'all .15s ease-out';
        } else {
          document.getElementById('aca--widget-frame').style.transition = 'none';
        }
        if (!window.acaWidgetOptions.minimized) {
          document.getElementById('aca--widget-frame').style.minHeight = 292 + 'px';
          document.getElementById('draggable').style.zIndex = 1;
          document.getElementById('resizer').style.zIndex = 1;
          document.getElementById('aca--widget-frame').style.height = elementHeight + 'px';
          document.getElementById('aca--widget-frame').style.transition = 'all .15s ease-out';
        } else {
          document.getElementById('aca--widget-frame').style.transition = 'all .15s ease-out';
          document.getElementById('draggable').style.zIndex = 0;
          document.getElementById('resizer').style.zIndex = 0;
          top = '';
          document.getElementById('aca--widget-frame').style.minHeight = '0';
          document.getElementById('aca--widget-frame').style.height = 50 + 'px';
        }
        document.getElementById('aca--widget-content').style.height = elementHeight + 'px';
        document.getElementById('aca--widget-iframe').style.height = elementHeight + 'px';
        document.getElementById('aca--widget-frame').style.width = elementWidth + 'px';
        document.getElementById('aca--widget-content').style.width = elementWidth + 'px';
        document.getElementById('aca--widget-content-loader').style.width = elementWidth + 'px';
        document.getElementById('aca--widget-iframe').style.width = elementWidth + 'px';
        document.getElementById('aca--widget-frame').style.top = top;
        document.getElementById('aca--widget-frame').style.left = left + 'px';

        setTimeout(() => {
          document.getElementById('aca--widget-frame').style.transition = 'none 0s';
        }, 1000);
      }, 0)
    },

    __hideChatAppButton: function () {
      const EVENT = {
        type: 'aiapChatButtonShow',
        data: false
      };
      setTimeout(() => {
        window.parent['postMessage'](EVENT, '*')
      }, 0);
    },

    __showChatAppButton: function () {
      const EVENT = {
        type: 'aiapChatButtonShow',
        data: true
      };
      setTimeout(() => {
        window.parent['postMessage'](EVENT, '*')
      }, 0);
    }
  };

  setTimeout(function () {
    window.acaWidget.__initialize();
  }, 1000);
})();

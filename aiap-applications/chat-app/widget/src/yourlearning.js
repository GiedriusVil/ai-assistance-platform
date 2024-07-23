window.acaWidgetAuthenticator = {
  __refreshToken: function() {
    // custom implementation goes here
    window.acaWidgetAuthenticator.jwtTokenAwait();
  },

  jwtTokenAwait: function () {
    setTimeout(function() {
      if (window.sessionStorage && window.sessionStorage.getItem('YL_JWT_VALUE')) {

        var _object = window.sessionStorage.getItem('YL_JWT_VALUE');
        var _params = [];

        _params.push('jwt=' + _object);

        // call function on the main widget scope
        if (window.acaWidget && typeof window.acaWidget.__iframeInitialize === 'function') {
          window.acaWidget.__iframeInitialize(_params);
        }
      } else {
        window.acaWidgetAuthenticator.jwtTokenAwait();
      }
    }, 100);
  },
};

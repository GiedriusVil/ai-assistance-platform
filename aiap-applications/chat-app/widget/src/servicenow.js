window.acaWidgetAuthenticator = {
  __refreshToken: function() {
    // custom implementation goes here
    if (typeof window.RefreshPatronToken !== 'function') {
      console.log('window.RefreshPatronToken function not implemented.');
    } else {
      // remove Patron token
      if (window.Patron) {
        console.log('window.Patron object deleted.');
        delete window.Patron;
      }

      // call external function to retrieve token
      window.acaWidgetAuthenticator.patronTokenAwait();

      console.log('window.RefreshPatronToken function called.');
      window.RefreshPatronToken();
    }
  },

  patronTokenAwait: function () {
    setTimeout(function() {
      if (window.Patron) {
        console.log(window.Patron);

        var _object = window.Patron;
        var _params = [];

        for (var property in _object) {
          if (Object.prototype.hasOwnProperty.call(_object, property)) {
            _params.push(property + '=' + _object[property]);
          }
        }

        // call function on the main widget scope
        if (window.acaWidget && typeof window.acaWidget.__iframeInitialize === 'function') {
          window.acaWidget.__iframeInitialize(_params);
        }
      } else {
        window.acaWidgetAuthenticator.patronTokenAwait();
      }
    }, 100);
  },
};

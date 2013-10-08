    
    define('rxdojo/request/script', ['dojo/request/script', 'rx'], function (script, rx) {

        /**
         * Sends a request using XMLHttpRequest with the given URL and options.
         * @param {String} url The URL that the request should be made to.
         * @param {Object} [options] A hash of options
         *  - {String = null} checkString The name of a variable that is defined in the loaded script that will determine if the request has finished.
         *  - {String|Object = null} query The query string, if any, that should be sent with the request.
         *  - {String} jsonp The name of the query parameter the server expects the name of the callback function to appear in.
         *  - {Boolean = false} preventCache If true will send an extra query parameter to ensure the browser and the server won’t supply cached values.
         *  - {Integer = null} timeout The number of milliseconds to wait for the response. If this time passes the request is canceled and the promise rejected.
         * @returns {Observable} An observable sequence which wraps the Dojo dojo/request/script function.
         */
        return function (url, options) {
            return rx.Observable.create(function (observer) {
                var promise = script(url, options).then(
                    function (value) {
                        observer.onNext(value);
                    },
                    function (err) {
                        observer.onError(err);
                    });

                return function () {
                    if (!promise.isFulfilled()) {
                        promise.cancel(new Error('Canceled'));
                    }
                };
            });
        };
    });

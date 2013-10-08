    define('rx/request/xhr', ['dojo/request/xhr', 'rx'], function (xhr, rx) {

        /**
         * Sends a request using XMLHttpRequest with the given URL and options.
         * @param {String} url The URL that the request should be made to.
         * @param {Object} [options] A hash of options
         *  - {String|Object = null} data Data, if any, that should be sent with the request. Newer browsers can use use FormData objects as well.
         *  - {String|Object = null} query The query string, if any, that should be sent with the request.
         *  - {Boolean = false} sync If the request should be blocking or not. If true the request will block until the request is resolved.
         *  - {Boolean = false} preventCache If true will send an extra query parameter to ensure the browser and the server won’t supply cached values.
         *  - {String = "GET"} method The HTTP method that should be used to send the request.
         *  - {Integer = null} timeout The number of milliseconds to wait for the response. If this time passes the request is canceled and the promise rejected.
         *  - {String = "text"} handleAs The content handler to process the response payload with.
         *  - {Object} A hash of the custom headers to be sent with the request. Defaults to:
                { 'Content-Type': 'application/x-www-form-urlencoded' } 
         * @param {Observer|Function} [observerOrOnNext] An Observer or function used to track progress.
         * @returns {Observable} An observable sequence which wraps the Dojo dojo/request/xhr function.
         */
        return function (url, options, observerOrOnNext) {
            return rx.Observable.create(function (observer) {
                var promise = xhr(url, options).then(
                    function (value) {
                        observer.onNext(value);
                    },
                    function (err) {
                        observer.onError(err);
                    },
                    function (progress) {
                        // If supports XHR2 Progress
                        if (typeof observerOrOnNext === 'function') {
                            observerOrOnNext(progress);
                        } else if (typeof observerOrOnNext === 'object') {
                            observerOrOnNext.onNext(progress);
                        }
                    });

                return function () {
                    if (!promise.isFulfilled()) {
                        promise.cancel(new Error('Canceled'));
                    }
                };
            });
        };
    });
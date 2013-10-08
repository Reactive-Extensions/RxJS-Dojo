    
    define('rxdojo/request', ['dojo/request', 'rx'], function (request, rx) {

        function executeRequest(method, context, url, options, observerOrOnNext) {
            return rx.Observable.create(function (observer) {
                var promise = method.call(context, url, options).then(
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
        }

        var rxRequest = {
            /**
             * Send an HTTP DELETE request using the default transport for the current platform.
             * @param {String} url The URL that the request should be made to.
             * @param {Object} [options] A hash of options
             *  - {String|Object = null} data Data, if any, that should be sent with the request. Newer browsers can use use FormData objects as well.
             *  - {String|Object = null} query The query string, if any, that should be sent with the request.
             *  - {Boolean = false} sync If the request should be blocking or not. If true the request will block until the request is resolved.
             *  - {Boolean = false} preventCache If true will send an extra query parameter to ensure the browser and the server won’t supply cached values.
             *  - {String = "DELETE"} method The HTTP method that should be used to send the request.
             *  - {Integer = null} timeout The number of milliseconds to wait for the response. If this time passes the request is canceled and the promise rejected.
             *  - {String = "text"} handleAs The content handler to process the response payload with.
             *  - {Object} A hash of the custom headers to be sent with the request. Defaults to:
                    { 'Content-Type': 'application/x-www-form-urlencoded' } 
             * @param {Observer|Function} [observerOrOnNext] An Observer or function used to track progress.
             * @returns {Observable} An observable sequence which wraps the Dojo dojo/request.del function.
             */         
            del: function (url, options, observerOrOnNext) {
                return executeRequest(request.del, request, url, options, observerOrOnNext);
            },

            /**
             * Send an HTTP GET request using the default transport for the current platform.
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
             * @returns {Observable} An observable sequence which wraps the Dojo dojo/request.get function.
             */         
            get: function (url, options, observerOrOnNext) {
                return executeRequest(request.get, request, url, options, observerOrOnNext);
            },

            /**
             * Send an HTTP POST request using the default transport for the current platform.
             * @param {String} url The URL that the request should be made to.
             * @param {Object} [options] A hash of options
             *  - {String|Object = null} data Data, if any, that should be sent with the request. Newer browsers can use use FormData objects as well.
             *  - {String|Object = null} query The query string, if any, that should be sent with the request.
             *  - {Boolean = false} sync If the request should be blocking or not. If true the request will block until the request is resolved.
             *  - {Boolean = false} preventCache If true will send an extra query parameter to ensure the browser and the server won’t supply cached values.
             *  - {String = "POST"} method The HTTP method that should be used to send the request.
             *  - {Integer = null} timeout The number of milliseconds to wait for the response. If this time passes the request is canceled and the promise rejected.
             *  - {String = "text"} handleAs The content handler to process the response payload with.
             *  - {Object} A hash of the custom headers to be sent with the request. Defaults to:
                    { 'Content-Type': 'application/x-www-form-urlencoded' } 
             * @param {Observer|Function} [observerOrOnNext] An Observer or function used to track progress.
             * @returns {Observable} An observable sequence which wraps the Dojo dojo/request.post function.
             */         
            post: function (url, options, observerOrOnNext) {
                return executeRequest(request.post, request, url, options, observerOrOnNext);
            },

            /**
             * Send an HTTP PUT request using the default transport for the current platform.
             * @param {String} url The URL that the request should be made to.
             * @param {Object} [options] A hash of options
             *  - {String|Object = null} data Data, if any, that should be sent with the request. Newer browsers can use use FormData objects as well.
             *  - {String|Object = null} query The query string, if any, that should be sent with the request.
             *  - {Boolean = false} sync If the request should be blocking or not. If true the request will block until the request is resolved.
             *  - {Boolean = false} preventCache If true will send an extra query parameter to ensure the browser and the server won’t supply cached values.
             *  - {String = "PUT"} method The HTTP method that should be used to send the request.
             *  - {Integer = null} timeout The number of milliseconds to wait for the response. If this time passes the request is canceled and the promise rejected.
             *  - {String = "text"} handleAs The content handler to process the response payload with.
             *  - {Object} A hash of the custom headers to be sent with the request. Defaults to:
                    { 'Content-Type': 'application/x-www-form-urlencoded' } 
             * @param {Observer|Function} [observerOrOnNext] An Observer or function used to track progress.
             * @returns {Observable} An observable sequence which wraps the Dojo dojo/request.put function.
             */         
            put: function (url, options, observerOrOnNext) {
                return executeRequest(request.put, request, url, options, observerOrOnNext);
            }          
        };

        return rxRequest;
    });

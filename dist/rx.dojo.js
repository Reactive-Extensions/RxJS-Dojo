// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.

(function (window, undefined) {

    var freeExports = typeof exports == 'object' && exports,
        freeModule = typeof module == 'object' && module && module.exports == freeExports && module,
        freeGlobal = typeof global == 'object' && global;
    if (freeGlobal.global === freeGlobal) {
        window = freeGlobal;
    }
    
    define('rxdojo/on', ['dojo/on', 'rx', 'rx.binding'], function (on, rx) {
        /**
         * A function that provides core event listening functionality. With this function you can provide a target, 
         * event type, and listener to be notified of future matching events that are fired.
         * @param {Element|Object} target This is the target object or DOM element that to receive events from.
         * @param {String|Function} type This is the name of the event to listen for or an extension event type.
         * @returns {Observable} An Observable sequence wrapping dojo/on
         */
        return function (target, type, dontFix) {
            return rx.Observable.create(function (observer) {
                function handler (e) {
                    observer.onNext(e);
                }

                var signal = on(target, type, handler, dontFix);

                return function () {
                    signal.remove();
                };
            }).publish().refCount();
        };
    });

    
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

}(this));
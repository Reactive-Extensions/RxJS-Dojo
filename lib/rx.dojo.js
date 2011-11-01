// Copyright (c) Microsoft Corporation.  All rights reserved.
// This code is licensed by Microsoft Corporation under the terms
// of the MICROSOFT REACTIVE EXTENSIONS FOR JAVASCRIPT AND .NET LIBRARIES License.
// See http://go.microsoft.com/fwlink/?LinkId=186234.

(function () {
    var global, root, observable, asyncSubject, observableCreate, copySettings;
    global = this;
    if (typeof ProvideCustomRxRootObject == "undefined") {
        root = global.Rx;
    } else {
        root = ProvideCustomRxRootObject();
    }
    observable = root.Observable;
    asyncSubject = root.AsyncSubject;
    observableCreate = observable.Create;
    copySettings = function (settings) {
        var newOptions = {};
        for (var k in settings) {
            newOptions[k] = settings[k];
        }
        return newOptions;
    };

    observable.FromDojoEvent = function (dojoObject, eventType, context, dontFix) {
        return observableCreate(function (observer) {
            var handler = function (eventObject) {
                observer.OnNext(eventObject);
            };
            var handle = dojo.connect(dojoObject, eventType, context, handler, dontFix);
            return function () {
                dojo.disconnect(handle);
            };
        });
    };
    dojo.xhrGetAsObservable = function (options) {
        var newOptions, subject;
        newOptions = copySettings(options);
        subject = new asyncSubject();
        newOptions.load = function (data) {
            subject.OnNext(data);
            subject.OnCompleted();
        };

        newOptions.error = function (error) {
            subject.OnError(error);
        };

        dojo.xhrGet(newOptions);
        return subject;
    };
    dojo.xhrPostAsObservable = function (options) {
        var newOptions, subject;
        newOptions = copySettings(options);
        subject = new asyncSubject();
        newOptions.load = function (data) {
            subject.OnNext(data);
            subject.OnCompleted();
        };
        newOptions.error = function (error) {
            subject.OnError(error);
        };
        dojo.xhrPost(newOptions);
        return subject;
    };

    dojo.xhrPutAsObservable = function (options) {
        var newOptions, subject;
        newOptions = copySettings(options);
        subject = new asyncSubject();
        newOptions.load = function (data) {
            subject.OnNext(data);
            subject.OnCompleted();
        };
        newOptions.error = function (error) {
            subject.OnError(error);
        };
        dojo.xhrPut(newOptions);
        return subject;
    };
    dojo.xhrDeleteAsObservable = function (options) {
        var newOptions, subject;
        newOptions = copySettings(options);
        subject = new asyncSubject();
        newOptions.load = function (data) {
            subject.OnNext(data);
            subject.OnCompleted();
        };
        newOptions.error = function (error) {
            subject.OnError(error);
        };
        dojo.xhrDelete(newOptions);
        return subject;
    };
    dojo.Deferred.prototype.asObservable = function () {
        var subject = new Rx.AsyncSubject();
        this.then(function (value) {
            subject.OnNext(value);
            subject.OnCompleted();
        },
        function (error) {
            subject.OnError(error);
        });
        return subject;
    };
    asyncSubject.prototype.AsDeferred = function () {
        var deferred = new dojo.Deferred();
        this.Subscribe(function (value) {
            deferred.callback(value);
        }, function (error) {
            deferred.errback(error);
        });
        return deferred;
    };
})();



    // Headers
    var observable = Rx.Observable,
        observableProto = observable.prototype,
        AsyncSubject = Rx.AsyncSubject,
        observableCreate = observable.create,
        rxDojo = Rx.dojo = {};

    function observableCreateRefCount(subscribe) {
    	return observableCreate(subscribe).publish().refCount();
    }
    
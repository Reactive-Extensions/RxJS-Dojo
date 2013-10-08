    
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

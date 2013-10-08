require(["rxdojo/on", "rxdojo/request/script", "dojo/dom", "dojo/domReady!", "rx", "rx.time"], function (on, script, dom) {

    // Search Wikipedia for a given term
    function searchWikipedia(term) {
        var cleanTerm = global.encodeURIComponent(term);
        var url = 'http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search='+ cleanTerm;
        return script(url, { jsonp: 'callback'});
    }

    function clearChildren (element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }                
    }

    function main() {
        var input = dom.byId('textInput'),
            results = dom.byId('results');

        // Get all distinct key up events from the input and only fire if long enough and distinct
        var keyup = on(input, 'keyup')
            .map(function (e) {
                return e.target.value; // Project the text from the input
            })
            .filter(function (text) {
                return text.length > 2; // Only if the text is longer than 2 characters
            })
            .throttle(750 /* Pause for 750ms */ )
            .distinctUntilChanged(); // Only if the value has changed

        var searcher = keyup.flatMapLatest(
            function (text) { 
                return searchWikipedia(text); // Search wikipedia
            });

        var subscription = searcher.subscribe(
            function (data) {
                // Append the results
                clearChildren(results);

                var res = data[1];

                var i, len, li;
                for(i = 0, len = res.length; i < len; i++) {
                    li = document.createElement('li');
                    li.innerHTML = res[i];
                    results.appendChild(li); 
                }
            }, 
            function (error) {
                // Handle any errors
                clearChildren(results);

                var li = document.createElement('li');
                li.innerHTML = 'Error: ' + error;
                results.appendChild(li);
            });
    }

    main();

});
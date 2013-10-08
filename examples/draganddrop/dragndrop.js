require(["rxdojo/on", "dojo/dom", "dojo/domReady!"], function (on, dom) {

    function main () {
        var dragTarget = dom.byId('dragTarget');

        // Get the three major events
        var mouseup = on(dragTarget, 'mouseup');
        var mousemove = on(document, 'mousemove');
        var mousedown = on(dragTarget, 'mousedown');

        var mousedrag = mousedown.flatMap(function (md) {

            // calculate offsets when mouse down
            var startX = md.offsetX, startY = md.offsetY;

            // Calculate delta with mousemove until mouseup
            return mousemove.map(function (mm) {
                (mm.preventDefault) ? mm.preventDefault() : event.returnValue = false; 

                return {
                    left: mm.clientX - startX,
                    top: mm.clientY - startY
                };
            }).takeUntil(mouseup);
        });

        // Update position
        subscription = mousedrag.subscribe(function (pos) {          
            dragTarget.style.top = pos.top + 'px';
            dragTarget.style.left = pos.left + 'px';
        });
    }

    main();

});
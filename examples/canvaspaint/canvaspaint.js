require(["rxdojo/on", "dojo/dom", "dojo/domReady!"], function (on, dom) {

    // Calcualte offset either layerX/Y or offsetX/Y
    function getOffset(event) {
        return { 
            offsetX: event.offsetX === undefined ? event.layerX : event.offsetX,
            offsetY: event.offsetY === undefined ? event.layerY : event.offsetY
        };
    }

    function main() {
        var canvas = dom.byId('tutorial');

        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
            ctx.beginPath();

            // Get mouse moves
            var mouseMoves = on(canvas, 'mousemove');

            // Calculate difference between two mouse moves
            var mouseDiffs = mouseMoves.bufferWithCount(2, 1).select(function (x) {
                return { first: getOffset(x[0]), second: getOffset(x[1]) };
            });
            
            // Get merge together both mouse up and mouse down
            var mouseButton = on(canvas, 'mousedown').select(function (x) { return true; })
                .merge(on(canvas, 'mouseup').select(function (x) { return false; }));

            // Paint if the mouse is down
            var paint = mouseButton.select(function (down) { return down ? mouseDiffs : mouseDiffs.take(0) }).switchLatest();

            // Update the canvas
            paint.subscribe(function (x) {
                ctx.moveTo(x.first.offsetX, x.first.offsetY);
                ctx.lineTo(x.second.offsetX, x.second.offsetY);
                ctx.stroke();
            });
        }
    }

    main();
});
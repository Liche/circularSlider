circularCursor = {};

circularCursor = function () {
    // Structure
    this.canvas;
    this.cursor;
    this.cursorRadius;
    this.turn;
    this.turnValue;
    this.incrementValue;
    this.canvasPosition;
    // Values
    this.angle;
    this.val;
    // Callbacks
    this.startCallback;
    this.moveCallback;
    this.endCallback;

    return this;
}

$.extend(circularCursor.prototype, {
    initialize: function (canvas, cursor, cursorRadius, turnValue, incrementValue) {
        this.canvas = canvas;
        this.cursor = cursor;
        this.cursorRadius = cursorRadius;
        this.turn = 0;
        this.turnValue = turnValue;
        this.incrementValue = incrementValue;
        this.val = 0;
        this.setCursorAngle(0);
        this.canvasPosition = $(canvas.canvas).offset();

        var item = this;
        this.cursor.drag(
            // onmove
            function (dx, dy, x, y, event) {
                var newAngle = item.getAngle(x - item.canvasPosition.left, y - item.canvasPosition.top);
                var oldAngle = item.angle;
                item.setCursorAngle(newAngle);
                if(item.moveCallback && typeof(item.moveCallback) === 'function') {
                    item.moveCallback();
                };
                item.angle = newAngle;
            },
            // onstart
            function (x, y, event) {
                if(item.startCallback && typeof(item.startCallback) === 'function') {
                    item.startCallback();
                };
            },
            // onend
            function (event) {
                if(item.endCallback && typeof(item.endCallback) === 'function') {
                    item.endCallback();
                };
            }
        );
    },

    getAngle: function (x, y) {
        var calcX = x - this.canvas.width / 2;
        var calcY = y - this.canvas.height / 2;

        return Math.atan2(calcX, -calcY);
    },

    setCursorAngle: function (angle) {
        var cursorX = this.cursorRadius * Math.sin(angle) + this.canvas.width / 2;
        var cursorY = this.canvas.height / 2 - this.cursorRadius * Math.cos(angle);
        this.cursor.attr({
            cx: cursorX,
            cy: cursorY,
        });
        this.setValueByAngles(angle, this.angle);
        this.angle = angle;
    },

    setValueByAngles: function(newAngle, oldAngle) {
        if(newAngle >= Math.PI / 2 && oldAngle < -Math.PI / 2) {
            this.turn--;
            if(this.turn < 0) this.turn = 0;
        }
        if(newAngle < -Math.PI / 2 && oldAngle >= Math.PI / 2) {
            this.turn++;
        }
        this.val = this.turnValue * (this.turn + newAngle / (2 * Math.PI));
        if(this.val < 0) {
            this.val = 0;
            this.setCursorAngle(0);
        }
        //gestion de l'incrément
        this.val = Math.floor(this.val / this.incrementValue) * this.incrementValue;
    },

    getValue: function() {

        return this.val;
    },

    setStartCallback: function(callback) {
        this.startCallback = callback;
    },

    setMoveCallback: function(callback) {
        this.moveCallback = callback;
    },

    setEndCallback: function(callback) {
        this.endCallback = callback;
    },
});
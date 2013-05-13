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
    this.min;
    this.max;
    this.angle;
    this.val;
    // Callbacks
    this.startCallback;
    this.moveCallback;
    this.endCallback;

    return this;
}

$.extend(circularCursor.prototype, {
    initialize: function (canvas, cursor, cursorRadius, turnValue, incrementValue, start = 0, min = null, max = null) {
        this.canvas = canvas;
        this.cursor = cursor;
        this.cursorRadius = cursorRadius;
        this.turn = 0;
        this.turnValue = turnValue;
        this.incrementValue = incrementValue;
        this.val = 0;
        this.setValue(start);
        this.canvasPosition = $(canvas.canvas).offset();
        this.min = min;
        this.max = max;
        var item = this;
        var startX;
        var startY;
        this.cursor.drag(
            // onmove
            function (dx, dy, x, y, event) {
                var newAngle = item.getAngle(startX + dx, startY + dy);
                item.setCursorAngle(newAngle);
                if(item.moveCallback && typeof(item.moveCallback) === 'function') {
                    item.moveCallback();
                };
            },
            // onstart
            function (x, y, event) {
                startX = this.attr('cx');
                startY = this.attr('cy');
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
    },
    setValue: function(value) {
        this.turn = Math.ceil((value - this.turnValue / 2) / this.turnValue);
        this.val = value;
        var fraction =
            this.val % this.turnValue < 0 ?
            this.val % this.turnValue + this.turnValue :
            this.val % this.turnValue;
        fraction = fraction / this.turnValue;
        this.angle =
            fraction > 0.5 ?
            2 * Math.PI * (fraction - 1) :
            2 * Math.PI * fraction;

        var cursorX = this.cursorRadius * Math.sin(this.angle) + this.canvas.width / 2;
        var cursorY = this.canvas.height / 2 - this.cursorRadius * Math.cos(this.angle);
        console.log('start : (' + cursorX + ', ' + cursorY + ')');
        this.cursor.attr({
            cx: cursorX,
            cy: cursorY,
        });
        return this.angle;
    },

    setValueByAngles: function(newAngle, oldAngle) {
        if(newAngle >= Math.PI / 2 && oldAngle < -Math.PI / 2) {
            this.turn--;
        }
        if(newAngle < -Math.PI / 2 && oldAngle >= Math.PI / 2) {
            this.turn++;
        }
        this.angle = newAngle;
        this.val = this.turnValue * (this.turn + newAngle / (2 * Math.PI));
        //gestion du minmax
        if(this.min != null && this.val < this.min) {
            this.setValue(this.min);
        }
        if(this.max != null && this.val > this.max) {
            this.setValue(this.max);
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
circularCursor = {};

circularCursor = function (cursor, cursorRadius, turnValue, incrementValue) {
    // Structure
    this.cursor = cursor;
    this.cursorRadius = cursorRadius;
    this.turn = 0;
    this.turnValue = turnValue;
    this.incrementValue = incrementValue;
    // Values
    this.center = {x: this.cursor.paper.width / 2, y: this.cursor.paper.height / 2};
    this.min = null;
    this.max = null;
    this.angle = 0;
    this.val = 0;
    // Callbacks
    this.startCallback = null;
    this.moveCallback = null;
    this.endCallback = null;

    return this;
}

$.extend(circularCursor.prototype, {
    initialize: function (args = {}) {
        if (args.min) {
            this.min = args.min;
        }
        if (args.max) {
            this.max = args.max;
        }
        if (args.center) {
            this.center = args.center;
        }
        if (args.start) {
            this.val = args.start
        }
        this.setValue(this.val);

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
        var calcX = x - this.center.x;
        var calcY = y - this.center.y;

        return Math.atan2(calcX, -calcY);
    },

    setCursorAngle: function (angle) {
        var cursorX = this.cursorRadius * Math.sin(angle) + this.center.x;
        var cursorY = this.center.y - this.cursorRadius * Math.cos(angle);
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

        var cursorX = this.cursorRadius * Math.sin(this.angle) + this.center.x;
        var cursorY = this.center.y - this.cursorRadius * Math.cos(this.angle);
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

    getAngle: function() {
        return this.angle;
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
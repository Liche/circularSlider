circularCursor = {};

circularCursor = function (_cursor, _cursorRadius, _turnValue, _incrementValue) {
    // Structure
    var _turn = 0;
    // Values
    var _center = {x: _cursor.paper.width / 2, y: _cursor.paper.height / 2};
    var _min = null;
    var _max = null;
    var _angle = 0;
    var _val = 0;
    // Callbacks
    var _startCallback = null;
    var _moveCallback = null;
    var _endCallback = null;

    var computeAngle = function (x, y) {
        var calcX = x - _center.x;
        var calcY = y - _center.y;

        return Math.atan2(calcX, -calcY);
    }

    var setValue = function(value) {
        _turn = Math.ceil((value - _turnValue / 2) / _turnValue);
        _val = value;
        var fraction =
            _val % _turnValue < 0 ?
            _val % _turnValue + _turnValue :
            _val % _turnValue;
        fraction = fraction / _turnValue;
        _angle =
            fraction > 0.5 ?
            2 * Math.PI * (fraction - 1) :
            2 * Math.PI * fraction;
        refreshCursor();
    }

    var refreshCursor = function() {
        var cursorX = _cursorRadius * Math.sin(_angle) + _center.x;
        var cursorY = _center.y - _cursorRadius * Math.cos(_angle);
        _cursor.attr({
            cx: cursorX,
            cy: cursorY,
        });
    }

    var setValueByAngles = function(newAngle, oldAngle) {
        if(newAngle >= Math.PI / 2 && oldAngle < -Math.PI / 2) {
            _turn--;
        }
        if(newAngle < -Math.PI / 2 && oldAngle >= Math.PI / 2) {
            _turn++;
        }
        _angle = newAngle;
        _val = _turnValue * (_turn + newAngle / (2 * Math.PI));
        //gestion du minmax
        if(_min != null && _val < _min) {
            setValue(_min);
        }
        if(_max != null && _val > _max) {
            setValue(_max);
        }
        //gestion de l'incrément
        _val = Math.floor(_val / _incrementValue) * _incrementValue;
    }

    var setCursorAngle = function (angle) {
        var cursorX = _cursorRadius * Math.sin(angle) + _center.x;
        var cursorY = _center.y - _cursorRadius * Math.cos(angle);
        _cursor.attr({
            cx: cursorX,
            cy: cursorY,
        });
        setValueByAngles(angle, _angle);
    }

    this.initialize = function (args) {
        if(typeof(args) !== 'object') args = {};
        if (args.min !== undefined) {
            _min = args.min;
        }
        if (args.max !== undefined) {
            _max = args.max;
        }
        if (args.center !== undefined) {
            _center = args.center;
        }
        if (args.start !== undefined) {
            _val = args.start
        }
        this.setValue(_val);

        var item = this;
        var startX;
        var startY;
        _cursor.drag(
            // onmove
            function (dx, dy, x, y, event) {
                var newAngle = computeAngle(startX + dx, startY + dy);
                setCursorAngle(newAngle);
                if(_moveCallback && typeof(_moveCallback) === 'function') {
                    _moveCallback();
                };
            },
            // onstart
            function (x, y, event) {
                startX = this.attr('cx');
                startY = this.attr('cy');
                if(_startCallback && typeof(_startCallback) === 'function') {
                    _startCallback();
                };
            },
            // onend
            function (event) {
                if(_endCallback && typeof(_endCallback) === 'function') {
                    _endCallback();
                };
            }
        );
    }

    this.setCenter = function(x, y) {
        _center.x = x;
        _center.y = y;
        refreshCursor();
    }

    this.setRadius = function(radius) {
        _cursorRadius = radius;
        refreshCursor();
    }

    this.setValue = function(value) {
        setValue(value);
    }

    this.getValue = function() {

        return _val;
    }

    this.getAngle = function() {

        return _angle;
    }

    this.getCoordinates = function(angle, radius) {
        return {
            x: _center.x + radius * Math.sin(angle),
            y: _center.y - radius * Math.cos(angle),
        }
    }

    this.setStartCallback = function(callback) {
        _startCallback = callback;
    }

    this.setMoveCallback = function(callback) {
        _moveCallback = callback;
    }

    this.setEndCallback = function(callback) {
        _endCallback = callback;
    }

    return this;
}
verticalSelector = {};

verticalSelector = function(_elem, _config) {
    _elem.addClass("lch-vs");
    // Base config
    var baseConfig = {cols: 1, startValue: 0, swipeTreshold: 5, disableScroll: true};
    var columns = new Array();
    var value = new Array();
    var changeCallback;
    var that = this;
    // ---
    // TOUCH CONFIG
    var touchStart = false;
    var movedCol;
    var startY, currY;
    // ---
    // Selector height
    var columnHeight;
    // ---
    var config = $.extend({}, baseConfig, _config);
    for (var i = config.cols -1; i >= 0; i--) {
        columns[i] = $('<ul/>');
        columns[i].html('<li>0</li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li>');
        value[i] = 0;
        columns[i].attr('data-column', i);
        _elem.append(columns[i]);
    }
    columnHeight = _elem.find('li:first').height();
    _elem.height(columnHeight);

    var setColumnValue = function (col, val) {
        value[col] = val;
        _elem.children('ul[data-column="' + col + '"]').animate({
            'margin-top': - val * columnHeight
        });
    }
    // Listeners
    _elem.children('ul').children('li').bind('touchstart mousedown', function (e) {
        touchStart = true;
        movedCol = $(this).parent().attr('data-column');
        startY = e.pageY || e.originalEvent.touches[0].pageY;
        if (config.disableScroll) e.preventDefault();
    });
    _elem.children('ul').children('li').bind('touchmove mousemove', function (e) {
        currY = e.pageY || e.originalEvent.touches[0].pageY;
        if (config.disableScroll) e.preventDefault();
    });
    $(window).bind('touchend mouseup touchcancel', function (e) {
        if (touchStart && config.swipeTreshold < startY - currY) {
            // Swipe up -> +1
            if (movedCol && value[movedCol] < 9) {
                if (!config.max || config.max >= that.getValue() + Math.pow(10, movedCol)) {
                    setColumnValue(movedCol, value[movedCol] + 1);
                    if(changeCallback && typeof(changeCallback) === 'function') {
                        changeCallback();
                    }
                }
            }
        } else if (touchStart && config.swipeTreshold < currY - startY) {
            // Swipe down -> -1
            if (movedCol && value[movedCol] > 0) {
                if (!config.min || config.min <= that.getValue() - Math.pow(10, movedCol)) {
                    setColumnValue(movedCol, value[movedCol] - 1);
                    if(changeCallback && typeof(changeCallback) === 'function') {
                        changeCallback();
                    }
                }
            }
        } else {
            // treshold not met, do nothing
        }
        touchStart = false;
    });

    this.getValue = function () {
        var sum = 0;
        for(var i in value) {
            sum += Math.pow(10, i) * value[i];
        }

        return sum;

    }

    this.setValue = function (val) {
        var extract;
        var iVal = val;
        for(var i in columns) {
            extract = iVal % 10;
            iVal = (iVal - extract) / 10;
            setColumnValue(i, extract);
        }
        if(changeCallback && typeof(changeCallback) === 'function') {
            changeCallback();
        }
    }

    this.setChangeCallback = function (callback) {
        changeCallback = callback;
    }
    this.setValue(config.startValue);

    return this;
};
(function ( $ ) {

    $.fn.horizontalSelector = function(_config) {
        this.addClass("lch-hs");
        var startX, currX, touchStart;
        var diffValue, newValue;
        var that = this;
        // Base config
        var baseConfig = {startValue: 0, divisionValue: 10, incrementValue: 1, disableScroll: true};
        var config = $.extend({}, baseConfig, _config);

        var canvasWidth = this.width();
        this.bind('touchstart mousedown', function (e) {
            touchStart = true;
            startX = e.pageX || e.originalEvent.touches[0].pageX;
            if (config.disableScroll) e.preventDefault();
        });
        $(window).bind('touchmove mousemove', function (e) {
            if (touchStart) {
                currX = e.pageX || e.originalEvent.touches[0].pageX;
                diffValue = (currX - startX) * config.divisionValue / canvasWidth;
                diffValue = diffValue > 0 ? Math.floor(diffValue) : Math.ceil(diffValue);
                if (diffValue != 0) {
                    startX = currX;
                    newValue = getValue() + diffValue * config.incrementValue;
                    if (newValue < config.min) {
                        newValue = config.min;
                    }
                    if (newValue > config.max) {
                        newValue = config.max;
                    }
                    that.text(newValue);
                    that.trigger('change');
                }
                if (config.disableScroll) e.preventDefault();
            }
        });
        $(window).bind('touchend mouseup touchcancel', function (e) {
            touchStart = false;
        });

        var getValue = function () {
            return parseInt(that.html());
        }
        this.text(config.startValue);
        return this;
    };
}( jQuery ));
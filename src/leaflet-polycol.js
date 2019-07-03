/**
 *  Polycol is a leaflet plugin that allows to fill polygon shapes with multiple colors.
 *  The primary drive behind the development was to use it as a kind of choropleth for a single polygon,
 *  ie to fill a polygon percentually with colors defined in the legend.
 *
 *  Main inspiration was from leaflet.polygon-fillPattern plugin (https://github.com/lwsu/leaflet-polygon-fillPattern)
 *  Author: rightdroid@gmail.com
 */

(function (window, document, undefined) {

if (L.Browser.canvas) {
    L.Canvas.include ({
        _fillStroke: function (ctx, layer) {
            var options = layer.options;

            if (options.fill) {
                if (typeof(options.fill) === "object") {
                    this.__polycol(ctx, layer, options.fill);
                }
                else
                {
                    ctx.globalAlpha = options.fillOpacity;
                    ctx.fillStyle = options.fillColor || options.color;
                    ctx.fill(options.fillRule || 'evenodd');
                }
            }

            if (options.stroke && options.weight !== 0) {
                if (ctx.setLineDash) {
                    ctx.setLineDash(layer.options && layer.options._dashArray || []);
                }
                ctx.globalAlpha = options.opacity;
                ctx.lineWidth = options.weight;
                ctx.strokeStyle = options.color;
                ctx.lineCap = options.lineCap;
                ctx.lineJoin = options.lineJoin;
                ctx.stroke();
            }
        },
        __polycol : function(ctx, layer, fill) {
            var bounds = layer._pxBounds || this.__polycolBounds; // if no data, use what was passed on first fill
            this.__polycolBounds = bounds; // first fill is guaranteed to pass initial data

            var fillData = fill || this.__polycolFillData;
            this.__polycolFillData = fillData;

            var _defaultNoDatacolor = 'rgb(50,50,50)',
            _maxPadding = 0.1,
            _defaultOrientation = 'vertical',
            _defaultPadding = 1; // this means 0.01 units in gradient scale


            var _padding = this.__clamp(fillData.padding, 0, 100) || _defaultPadding;
            var _noDataColor = fillData.noDataColor || _defaultNoDatacolor;
            var _orientation = fillData.orientation || _defaultOrientation;

            // padding between gradient colors to add smoothness
            _padding = (_padding * _maxPadding) / 100;

            // gradient orientation, default vertical/top-down
            var xDiff = ((bounds.max.x - bounds.min.x) / 2);
            var yDiff = ((bounds.max.y - bounds.min.y) / 2);
            var gradient;
            if(_orientation == 'horizontal')
            {
                gradient = ctx.createLinearGradient(bounds.min.x, bounds.min.y + yDiff, bounds.max.x, bounds.max.y - yDiff);
            }
            else
            {
                gradient = ctx.createLinearGradient(bounds.min.x + xDiff, bounds.min.y, bounds.max.x - xDiff, bounds.max.y);
            }

            var step = 0;
            for (var i = 0; i < fillData.data.length; i++) {
                var color = Object.keys(fillData.data[i])[0];
                var percent = Object.values(fillData.data[i])[0];

                // safeguard against going over 1
                if(step > 1 || step + (percent/100) > 1) continue;

                gradient.addColorStop(step + _padding, color);
                gradient.addColorStop(step + (percent/100), color);

                step = (percent/100) + step;
            }

            // add noDataColor if passed data does not take up all of polygon
            if(step < 1)
            {
                gradient.addColorStop(step + _padding, _noDataColor);
                gradient.addColorStop(1, _noDataColor);
            }

            ctx.fillStyle = gradient;
            ctx.fill(layer.options.fillRule);
        },

        __clamp : function(number, min, max) {
            return Math.min(Math.max(number, min), max);
        }
    });
}

}(this, document));


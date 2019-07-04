/**
 *  Polycol is a leaflet plugin that allows you to fill polygon shapes with multiple colors.
 *  The primary drive behind the development was to use it as a kind of a primitive choropleth for a single polygon,
 *  ie to fill a polygon percentually with colors defined in the legend.
 *
 *  Author: rightdroid@gmail.com
 */

L.Polycol = L.Polygon.extend({
    _originalInitialize: L.Polygon.prototype.initialize,

    initialize: function (latlngs, options) {
        this._originalInitialize(latlngs, options);
    },

    _updatePath: function () {
        if(typeof(this.options.fill) === 'object' && 'data' in this.options.fill)
        {
            this._renderer._updatePolycol(this, true);
        }
        else
        {
            this._renderer._updatePoly(this, true);
        }
    }
})


L.polycol = function(latlngs, options) {
    return new L.Polycol(latlngs, options);
};


L.Canvas.include({

    // _updatePolycol is a copypaste from _updatePoly, except this._fillStroke
    // is switched to this._fillStrokePolycol. We do not want to overwrite
    // default Leaflet Canvas functions.
    _updatePolycol: function (layer, closed) {
        if (!this._drawing) { return; }

        var i, j, len2, p,
            parts = layer._parts,
            len = parts.length,
            ctx = this._ctx;

        if (!len) { return; }
        ctx.beginPath();

        for (i = 0; i < len; i++) {
            for (j = 0, len2 = parts[i].length; j < len2; j++) {
                p = parts[i][j];
                ctx[j ? 'lineTo' : 'moveTo'](p.x, p.y);
            }
            if (closed) {
                ctx.closePath();
            }
        }

        this._fillStrokePolycol(ctx, layer);
    },

    // slightly modified from _fillStroke
    _fillStrokePolycol: function (ctx, layer) {
        var options = layer.options;

        if (options.fill) {
            this._polycol(ctx, layer, options.fill);
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

    _polycol : function(ctx, layer, fill) {
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
        if(_orientation == 'horizontal') gradient = ctx.createLinearGradient(bounds.min.x, bounds.min.y + yDiff, bounds.max.x, bounds.max.y - yDiff);
        else gradient = ctx.createLinearGradient(bounds.min.x + xDiff, bounds.min.y, bounds.max.x - xDiff, bounds.max.y);

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

    // helper function
    __clamp : function(number, min, max) {
        return Math.min(Math.max(number, min), max);
    }
})


# Leaflet Polycol

## Demo
https://rightdroid.bitbucket.io/leaflet-polycol/

## Overview

![example](https://i.imgur.com/wkxGLgw.png)

With **leaflet-polycol**, you can fill a single polygon with multiple colors, divided percentually by the data you pass. Polycol uses canvas' *createLinearGradient* and only works when using Leaflet's Canvas renderer (*preferCanvas : true*).

The primary drive behind the development was to use it as a kind of a primitive choropleth for a single polygon - to fill a polygon percentually with colors defined in legend.

***Note***: Polycol fill pattern is rectangular and does not give accurate percentual visual when the polygon is round or irregular. Polycol does not actually compute the area of polygon, it just lays a rectangular gradient over it.

## Requirements

 - Leaflet 1.5.1+
 - Using canvas renderer in Leaflet (default is SVG renderer)

## How to use

Define polygol options
```javascript
polycolOptions = {
    data : [
        {'blue' : 33},
        {'black' : 33},
        {'white' : 33},
    ]
}
```
---
Initialize a polycol with polycolOptions passed to fill property
```javascript
var polycol = L.polycol(coords,
    {
        color : 'black',
        fill : polycolOptions
    })
```
or
```javascript
var polycol = new L.Polygon(coords,
    {
        color : 'black',
        fill : polycolOptions
    })
```

---
Add to map:
```javascript
polycol.addTo(map);
```

## Options

Polycol options is an object with following properties:

 - **data**
     - *type* : `array`
     - *default* : None
     - *accepts* : objects as `{'stringColorName' : intPercentage}`
     - description :  main data that holds colors and their associated percentages
 - **padding**
     - *type* : `int`
     - *default* : 1
     - *accepts* : from 0 to 100
     - description :  padding between two colors to create smoothness, from 0 to 100
 - **noDataColor**
     - *type* : `string`
     - *default* : 'rgb(50,50,50)'
     - *accepts* : RGB/HEX/browser accepted color string
     - description :  color for the part of polygon that has no data (remaining percentage)
 - **orientation**
     - *type* : `string`
     - *default* : 'horizontal'
     - *accepts* : 'horizontal', 'vertical'
     - description :  whether the gradient runs vertically or horizontally


## Changing Leaflet's canvas renderer

Leaflet's default canvas renderer is *SVG*. To use polycol, this needs to be set to *canvas*.
When you initialize Leaflet map, use `preferCanvas : true` in map options ( [docs](https://leafletjs.com/reference-1.0.0.html#map-prefercanvas) ):

```javascript
var map = L.map('map',
{
    preferCanvas : true
});
```

## Examples

Check out the [demo ](https://rightdroid.bitbucket.io/leaflet-polycol/)and [main.js](https://rightdroid.bitbucket.io/leaflet-polycol/js/main.js) file.

```javascript
polycolOptions = {
    data : [
        {'blue' : 33},
        {'black' : 33},
        {'white' : 33},
    ]
}

var polycol = L.polycol(coords1,
    {
        color : 'black',
        fill : polycolOptions
    });
polycol.addTo(map);


L.polycol(coords2,
    {
        color : 'rgb(100,100,100)',
        fill : {
            padding : 20, // padding between two colors to create smoothness, from 0 to 100
            noDataColor : 'violet', // can define color for the part of polygon that has no data (remaining percentage)
            data : [
                {'rgba(192,43,96,.5)' : 15},
                {'rgba(92,43,96,.5)' : 5},
                {'rgba(192,143,96,.5)' : 16},
                {'rgba(92,143,196,1)' : 14},
                {'rgba(10,43,196,.9)' : 10},
                {'rgba(50,90,96,.5)' : 18},
            ]
        }
    }).addTo(map);


L.polycol(coords3,
    {
        color : 'transparent',
        fill : {
            padding : 20,
            noDataColor : 'rgba(0,0,0,0)',
            orientation : 'horizontal', // change orientation
            data : [
                {'rgba(192,43,96,.5)' : 15},
                {'rgba(92,43,96,.5)' : 5},
                {'rgba(192,143,96,.5)' : 16},
                {'rgba(92,143,196,1)' : 14},
                {'rgba(10,43,196,.9)' : 10},
                {'rgba(50,90,96,.5)' : 18},
            ]
        }
    }).addTo(map);
```
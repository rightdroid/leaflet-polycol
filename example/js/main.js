var map = L.map('map',
{
    preferCanvas : true // this is necessary
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

map.fitBounds([[59.64831609639064, 28.542480468750004],
            [57.941098851575376, 21.950683593750004]]);

// these are drawn as geojson, so conversion is necessary
h = L.GeoJSON.coordsToLatLngs(h, 0);
i = L.GeoJSON.coordsToLatLngs(i, 0);
i_dot = L.GeoJSON.coordsToLatLngs(i_dot, 0);

polycolOptions = {
    data : [
        {'blue' : 33},
        {'black' : 33},
        {'white' : 33},
    ]
}

L.polygon(h,
    {
        color : 'black',
        fill : polycolOptions
    }).addTo(map);


L.polygon(i,
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


L.polygon(i_dot,
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





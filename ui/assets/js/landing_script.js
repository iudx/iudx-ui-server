//disable zoomControl when initializing map (which is topleft by default)

var map = L.map('map', {
    zoomControl: false,
    attributionControl: false

    //... other options

    // Tell the map to use a loading control
    //  loadingControl: true
});

//map.setView([23.2599, 77.4126], 5);
//add zoom control with your options


L.control.zoom({
    position: 'topleft'
}).addTo(map);


var tile_layer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    // attribution: '<span id="map_attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions" target="_blank">CARTO</a><br>' + get_icon_attribution_html("map_icon_attr") + '</span>',
    subdomains: 'abcd',
    maxZoom: 100
});

tile_layer.addTo(map);


link = L.control({ position: 'bottomright' });
link.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'myclass');
    div.innerHTML = `<span>Checkout the API Documentation <a href='https://apidocs.iudx.org.in/' target="_blank">here</a></span>`;
    return div;
}
link.addTo(map);

link = L.control({ position: 'topright' });
link.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'username');
    div.innerHTML = `<span id="username" style="font-size:20px; font-weight:bold; border:2px solid #ffae8f; padding:10px;color:#ff677d; border-radius: 1%; background-color: white; opacity:.95"></span>`;
    return div;
}
link.addTo(map);

L.Control.Watermark = L.Control.extend({
    onAdd: function (map) {
        var img = L.DomUtil.create('img');

        img.src = cat_conf['smart_city_iudx_logo'];
        img.style.width = '200px';

        return img;
    },




    onRemove: function (map) {
        // Nothing to do here
    }
});

L.control.watermark = function (opts, opts1) {
    return new L.Control.Watermark(opts, opts1);
}

L.control.watermark({ position: 'bottomright' }).addTo(map);

// for (let index = 0; index < array.length; index++) {
//     const element = array[index];
    
// }

$("#map").hide();

function onClick_Marker(e) {
    var markers = e.target;
    console.log(e.target)
    _urlId = markers.myJsonData['__instance-id']
    sessionStorage.setItem("c_url", _urlId)
    }


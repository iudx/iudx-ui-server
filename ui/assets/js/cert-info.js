var _urlId ;
const cert_class_threshold = 3

//  const iudx_instances = [{
//      "instance_name": "pudx",
//      "lat_lng": [18.4939, 73.8349]
//  }]

    $(document).ready(function () {
        // ajax call to auth for getting certificate info
    $.post( "https://auth.iudx.org.in/auth/v1/certificate-info", function( data ) {
        $("#username").html(`<span> Welcome, ` + data["id"] + `</span>`)
        $("#map").show();
        sessionStorage.setItem("cert-info", JSON.stringify(data));
        $.get('https://catalogue.iudx.org.in/catalogue/internal_apis/getcities',function(data){
        x= JSON.parse(data)   
        var arr=[];
        var markers;
        for(i=0;i<x.length;i++){
            // console.log(x[i])
            // console.log(x[i]['__instance-id']);
            // console.log(x[i]['configurations']);

            if(x[i]['__instance-id'] == "ui-test.iudx.org.in")
                continue

            arr[i] = x[i]['configurations']['map_default_view_lat_lng']
            map.setView(x[i]['configurations']['map_default_view_lat_lng'], 5);
            //arr.push()
            console.log(arr[i]['0'])

            if(JSON.parse(sessionStorage.getItem("cert-info"))['certificate-class'] < cert_class_threshold){
                console.log(1)
                sessionStorage.setItem("c_url", x[i]['__instance-id'])
                marker = new L.Marker(new L.LatLng(arr[i]['0'],arr[i]['1']))
                marker.on('click', function(e){
                    redirect_to("/c/")
                }).addTo(map)
                map.addLayer(marker);
            }
            else{
                console.log(2,sessionStorage.getItem("cert-info")['certificate-class'] < cert_class_threshold,cert_class_threshold)
                marker = new L.Marker(new L.LatLng(arr[i]['0'],arr[i]['1']))
                map.addLayer(marker);
                marker.bindPopup(L.popup()
                .setContent( 
                            "<a href=\""+get_redirect_url('/p/dashboard')+"\" > Provider Mode</a><br>"
                            + "<a href=\""+get_redirect_url('/c/')+"\"> Consumer Mode </a>"))
                            .bindTooltip(x[i]['configurations']['smart_city_name'])
                            .on('click', onClick_Marker)
                            marker.myJsonData = x[i];    
            }
        }  
    });
   
        // for (let index = 0; index < getIudxInstances().length; index++) {
        //     console.log(getIudxInstances())
        //     L.marker(getIudxInstances()[index]['configurations']['map_default_view_lat_lng'])
        //         .addTo(map).bindPopup(L.popup()
        //                                 .setContent( 
        //                                             "<a href=\""+get_redirect_url('/p/dashboard')+"\" > Provider Mode</a><br>"
        //                                             + "<a href=\""+get_redirect_url('/c/')+"\" > Consumer Mode</a>"))
        //                                             .bindTooltip(getIudxInstances()[index]['configurations']['smart_city_name'])
        // }
    });
    }); 
function get_landing_welcome_msg(_d){
    var slt_ct = "Select any IUDX instance shown in the map."
    var msg = ""
    if(parseInt(_d["certificate-class"]) < cert_class_threshold){
        msg = "Welcome " + _d["id"] + ". <br>You are consumer."
    }else{
        msg = "Welcome " + _d["id"] + ". <br>You can either act as a provider or consumer."
    }
    return msg+"<br>"+slt_ct
}

 
// function getInstanceId(__url){
                     
//        url_id = __url;
//        console.log(url_id)  

//  }

   
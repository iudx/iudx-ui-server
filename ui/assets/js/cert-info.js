const cert_class_threshold = 3

const iudx_instances = [{
    "instance_name": "pudx",
    "lat_lng": [18.4939, 73.8349]
}]



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

// ajax call to auth for getting certificate info
$.post( cat_conf["auth_base_URL"] + "/certificate-info", function( data ) {
    sessionStorage.setItem("cert-info", JSON.stringify(data));

    if(data['certificate-class'] < cert_class_threshold){
        redirect_to("/c/")
    }else{
        // _alertify(get_landing_welcome_msg(data))
        $("username").html(`<span>` + data["id"] + `</span>`)
        $("#map").show();
        for (let index = 0; index < iudx_instances.length; index++) {
            L.marker(iudx_instances[index]["lat_lng"])
                .addTo(map).bindPopup(L.popup()
                                        .setContent(iudx_instances[index]["instance_name"] 
                                                    + "<br>"
                                                    + "<a href=\""+get_redirect_url('/p/dashboard')+"\" > Provider Mode</a><br>"
                                                    + "<a href=\""+get_redirect_url('/c/')+"\" > Consumer Mode</a>"))
        }
    }
});
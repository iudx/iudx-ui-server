var cat_conf = null
var legends = null
var icon_attribution = null
var conf_url = '';

var DEBUG = false;
// ENABLE/DISABLE Console Msgs
if(!DEBUG){
    var methods = ["log", "debug", "warn", "info"];
    for(var i=0;i<methods.length;i++){
        console[methods[i]] = function(){};
    }
}


function get_redirect_url(u){
    return window.location.origin + u
}

function redirect_to(u){
    window.location.href = window.location.origin + u
}

function redirect_to_with_msg(u, msg){
    window.location.href = window.location.origin + u
    alert(msg)
}

function conf_ajax_call(__url){
	return new Promise((resolve, reject) => {
        $.ajax({
            "url": __url,
            "async": false,
            "method": 'GET',
            success: function (data) {
                resolve(data)
            },
            error: function (error) {
                reject(error)
            },
            timeout: 30000 // sets timeout to 30 seconds
        })
    })
}; 
    
function get_instance_id(){
    return sessionStorage.getItem("c_url")
}

if(get_instance_id() == "" || get_instance_id()==null){
    if(window.location.href != window.location.origin + "/"){
        redirect_to("/")
    }
}

if(window.location.href != window.location.origin + "/"){
    conf_ajax_call('https://'+get_instance_id() +'/catalogue/internal_apis/getconfig')
        // conf_ajax_call('https://ui-test.iudx.org.in/catalogue/internal_apis/getconfig')
            .then(data => {
                data = JSON.parse(data)
                console.log(data)
                cat_conf = data[0]['configurations']
                legends = data[0]['legends']
                icon_attribution = data[0]['global_configuration']['icon_attribution']
                // console.log(cat_conf, legends, icon_attribution)
                // _alertify("Success!!!", '<pre id="custom_alertbox">' + jsonPrettyHighlightToId(data) + '</pre>')
            })
            .catch(error => {
                // _alertify("Error!!!", '<pre id="custom_alertbox">: ' + error["statusText"] + '</pre>');
                console.log(error)
            })
}

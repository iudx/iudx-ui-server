/*****Global variables declaration *****/
// var _provider_data;
// var _tags_data;
// var _resourceServerGroup_data;
// var _geoJSONObject;
// var _resourceId_data ;


var tags_set = [];
var first_get_item_call_done=false
var page_limit = 10;
var max_visible_pagesinpagination_bar = 10;
var __DATA;

var highlightStyle = {
    color: '#ff0000',
    opacity:1,
    weight: 3,
    fillOpacity: 1,
};

var defaultStyle = {
    color: '#000000',
    opacity:0.5,
    weight: 1,
    fillOpacity: 0.7,
};
// var conf_URL = url_id;


function get_conf_url(){
    return conf_URL;
}
function get_global_data(){
	return __DATA;
}

function get_page_limit(){
	return page_limit;
}

// To be used when UI has the ability to showcase this feature
function set_page_limit(_page_limit){
	page_limit = _page_limit;
}

function set_data_globally(_data){
	__DATA = _data;
}

function min(val1, val2){
	return Math.min(val1, val2);
}

function is_attr_empty(_attr_name,_attr_value){
    if(_attr_name === "" || _attr_value === ""){
        _alertify("Error!!!", "Attribute-Name or Value missing");
        return true;
    }
}

function get_item_count(__data){
	var _c=0;
	for (var i = __data.length - 1; i >= 0; i--) {
		if(__data[i]['itemType']['value']=="resourceItem"){
			_c+=1;
		}
	}
	return _c;
}

function json_to_htmlcard(json_obj){
    if(json_obj['id'].split("/").length < 5){
        return ``
    }
    else{
        var openapi_url = "blah_blah"
        // var openapi_url = json_obj["accessInformation"]["value"][0]["accessObject"]["value"]
        // var openapi_url = json_obj["accessInformation"]["value"][0]["accessObject"]["value"]
        // //console.log(openapi_url)
        var is_public = (json_obj['secure']||[]).length === 0;
        var rat_btn_html=`<button class="btn btn-success" onclick="request_access_token('` + json_obj.id + `', '`+ json_obj["resourceServerGroup"]["value"] + `', '`+ json_obj["resourceId"]["value"] + `')" style="background-color:green">Request Access Token</button>`
        var s = json_obj["id"].split("/")
        return `
            <div class="col-12 card-margin-top">
            <div class="card">
              <h5 class="card-header card-header-color">
              <span class="float-left" style="padding-right:7.5px;"><img src='`+
              ((is_public) ? "../assets/img/icons/green_unlock.svg" : "../assets/img/icons/red_lock.svg")
              +`' class='img-fluid secure_icon'></span>` + get_horizontal_spaces(3) + s.splice(2).join("/") + " <b>BY</b> " + s[0]  + `</h5>
              <div class="card-body">
                <h5 class="card-title">` + json_obj["itemDescription"] + `</h5>
                <strong>Item-ID</strong>: `+json_obj['id']+`<br>
                <strong>Onboarded-By</strong>: `+json_obj['onboardedBy']+`<br>
                <strong>Access</strong>: `+ (is_public ? "Public": "Requires Authentication") +`<br>
                <div id="btn_`+resource_id_to_html_id(json_obj.id)+`">
                <button class="btn btn-primary" onclick="show_details('`+ json_obj.id +`')">Details</button>
                <!--button class="btn btn-success" onclick="display_swagger_ui('` + openapi_url + `')">API Details</button-->
                `+ ((is_public)?"":rat_btn_html) +`
                <a href="#" style="color:white"  class="data-modal" onclick="display_latest_data(event, this, '`+json_obj['id']+`')"><button class="btn btn-danger">Get Latest Data</button></a>
                <a href="#" style="color:white"  class="data-modal" onclick="display_temporal_data(event, this, '`+json_obj['id']+`')"><button class="btn btn-warning">Get Temporal Data</button></a>
                </div>
                 <div id="token_section_`+resource_id_to_html_id(json_obj.id)+`" class="token_section"></div>
              </div>
              <div id="details_section_`+resource_id_to_html_id(json_obj.id)+`" class="details_section">
                <table class="table table-borderless table-dark">
                  <thead>
                    <tr></tr>
                  </thead>
                  <tbody id="_tbody_`+resource_id_to_html_id(json_obj.id)+`">

                  </tbody>
                </table>
                <p id="extra_links_`+resource_id_to_html_id(json_obj.id)+`"></p>
              </div>
            </div>
            </div>
        `   
    }
}

function show_details(_id){
    var id = resource_id_to_html_id(_id)
    // console.log($("#details_section_"+id).is(':visible'))
    if(!($("#details_section_"+id).is(':visible'))) {
        $.get(cat_conf['cat_base_URL'] + "/items/" + _id , function(data) {
            data=JSON.parse(data)
            // //console.log(data)
            // //console.log(data[0]["resourceId"]["value"])
            // //console.log(data[0]["itemDescription"])
            // //console.log(data[0]["itemType"]["value"])
            // //console.log(data[0]["provider"]["value"])
            // //console.log(data[0]["createdAt"]["value"])
            // //console.log(data[0]["resourceServerGroup"]["value"])
            // //console.log(data[0]["itemStatus"]["value"])
            // //console.log(data[0]["refBaseSchema"]["value"])
            // //console.log(data[0]["refDataModel"]["value"])
            ////console.log(id);
            
            $("#_tbody_"+id).html(`
                <tr>
                      <th scope="row">Resource-Id</th>
                      <td>`+ data[0]["resourceId"]["value"] +`</td>
                </tr>
                <tr>
                      <th scope="row">Description</th>
                      <td>`+ data[0]["itemDescription"] +`</td>
                </tr>
                <tr>
                      <th scope="row">Type</th>
                      <td>`+ data[0]["itemType"]["value"] +`</td>
                </tr>
                <tr>
                      <th scope="row">Provider</th>
                      <td>`+ data[0]["provider"]["value"] +`</td>
                </tr>
                <tr>
                      <th scope="row">Created-On</th>
                      <td>`+ data[0]["createdAt"]["value"] +`</td>
                </tr>
                <tr>
                      <th scope="row">Resource Server Group</th>
                      <td>`+ data[0]["resourceServerGroup"]["value"] +`</td>
                </tr>
               
                <tr>
                      <th scope="row">Status</th>
                      <td>`+ data[0]["itemStatus"]["value"] +`</td>
                </tr>
            `);
             // <tr>
                //       <th scope="row">Authorization Server Info</th>
                //       <td>`+ data[0]["authorizationServerInfo"]["value"]["authServer"] +` | Type: `+ data[0]["authorizationServerInfo"]["value"]["authType"] +`</td>
             //    </tr>

                $("#extra_links_"+id).html(`
                <p class="details_p">
                    <!--<a href="`+ get_latest_data_url() +`">Latest Data</a>   |  -->
                    <a href="`+data[0]["refBaseSchema"]["value"]+`" target="_blank">Base Schema </a> |
                    <a href="`+data[0]["refDataModel"]["value"]+`" target="_blank">Data Model </a>
                </p>
                `);
        });
    }
    $("#details_section_"+id).toggle();
}

function display_paginated_search_results(page_num){
	var global_data = get_global_data();
	$("#searched_items").html("");
	var from = min(((page_num-1)*get_page_limit()),global_data.length);
	var to = min(((page_num)*get_page_limit()-1), global_data.length);
	for (var i=from;i < to; i++) {
		$("#searched_items").append(json_to_htmlcard(global_data[i]));	
	}
	// //console.log("dislpaying item from:"+from+" to:"+to + " " + (global_data.length/get_page_limit() + ((global_data.length%get_page_limit())>0) ? 1 : 0));
}

function populate_pagination_section(){
    // init bootpag
    var data_length = get_global_data().length
    console.log(data_length)
    $('#page-selection').bootpag({
        total: (data_length/get_page_limit() + (((data_length%get_page_limit())>0) ? 1 : 0)),
        maxVisible: max_visible_pagesinpagination_bar,
        leaps: true,
		next: '>',
		prev: '<',
	    firstLastUse: true,
	    first: '<<',
	    last: '>>',
	    wrapClass: 'pagination',
	    activeClass: 'page-active',
	    disabledClass: 'disabled',
	    nextClass: 'next',
	    prevClass: 'prev',
	    lastClass: 'last',
	    firstClass: 'first'
    }).on("page", function(event, /* page number here */ num){
          display_paginated_search_results(num);
    });

    display_paginated_search_results(1);

}

function display_search_section(){
    $(".section").fadeOut(200);
    $("body").css("background-image","none");
    $("#search_section").fadeIn(1500);
}

function get_icon_credits() {

    var str = `Various icons used in this web app have been taken from <a href="` + icon_attribution['site_link'] + `" target="_blank">` + icon_attribution['site'] + `</a> and belong to the following authors.<br><ul>`

    for (var i = 0; i < icon_attribution['author'].length; i++) {
        for (var key in icon_attribution['author'][i]) {
            str += `<li><a href="` + icon_attribution['author'][i][key] + `" target="_blank">` + key + `</a></li>`;
        }
    }

    str += "</ul>"

    _alertify("Icon Credits", str);
}

function get_icon_attribution_html(map_icon_attr) {
    // return `<span class="` + map_icon_attr + `">Icons made by <a href="`+icon_attribution['author_link']+`" target="_blank">`+icon_attribution['author']+`</a> from <a href="`+icon_attribution['site_link']+`" target="_blank">`+icon_attribution['site']+`</a>.</span>`
    return `<span class ="` + map_icon_attr + `">Icons from <a href="` + icon_attribution['site_link'] + `" target="_blank">` + icon_attribution['site'] + `</a> | <a href="#" onclick="get_icon_credits()">Credits</a></span>`
}

function getImageRsg(_resourceServerGroup) {
    return legends[_resourceServerGroup]
}

function copyToClipboard(element_id) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($("#token_value_"+element_id).text()).select();
    // $("#copied_"+element_id).html("Token copied!")
    document.execCommand("copy");
    $temp.remove();
    _alertify("Success!!!", "Token copied!")
    // $.sweetModal({
    //   title: 'Token copied!',
    //   theme: $.sweetModal.THEME_DARK
    // });
}

// Spinner by https://tobiasahlin.com/spinkit/
function get_spinner_html() {
    return `
    <div class="spinner">
      <div class="rect1"></div>
      <div class="rect2"></div>
      <div class="rect3"></div>
      <div class="rect4"></div>
      <div class="rect5"></div>
    </div>
    `
}

function get_api_encoded_attr_(_attr) {
    return _attr;
}

function get_api_encoded_attribute_names(__tags, __rsg, __pvdr) {
    var str = []
    if (__tags.length != 0) {
        str.push(get_api_encoded_attr_("tags"))
    } if (__rsg.length != 0) {
        str.push(get_api_encoded_attr_("resourceServerGroup"))
    } if (__pvdr.length != 0) {
        str.push(get_api_encoded_attr_("provider"))
    }
    //console.log(str.join(","))
    return "(" + str.join(",") + ")"

}

function get_api_encoded_attribute_values(__tags, __rsg, __pvdr) {
    var str = []
    if (__tags.length != 0) {
        str.push(get_api_encoded_attr_("(" + __tags.join(",") + ")"))
    } if (__rsg.length != 0) {
        str.push(get_api_encoded_attr_("(" + __rsg.join(",") + ")"))
    } if (__pvdr.length != 0) {
        str.push(get_api_encoded_attr_("(" + __pvdr.join(",") + ")"))
    }
    //console.log(str.join(","))
    return "(" + str.join(",") + ")"
}

function __get_latest_data(__url, __rid) {
    return new Promise((resolve, reject) => {
        $.ajax({
            "url": __url,
            "async": true,
            "crossDomain": true,
            "processData": false,
            "method": 'POST',
            "headers": { "Content-Type": "application/json" },
            "data": JSON.stringify({
                "id": __rid,
                "options": "latest"
            }),
            // dataType: 'json',
            success: function (data) {
                resolve(data)
            },
            error: function (error) {
                reject(error)
            },
            timeout: 30000 // sets timeout to 30 seconds
        })
    })
}

function call_metrics_api(__url) {
    return new Promise((resolve, reject) => {
        $.ajax({
            "url": __url,
            "async": false,
            "crossDomain": true,
            "processData": false,
            "method": 'POST',
            "headers": { "Content-Type": "application/json" },
            "data": JSON.stringify({
                "options": "total"
            }),
            // dataType: 'json',
            success: function (data) {
                resolve(data)
            },
            error: function (error) {
                reject(error)
            },
            timeout: 30000 // sets timeout to 30 seconds
        })
    })
}

function get_temporal_query_time_in_iso_8601_format(__days){
    return new Promise((resolve, reject) => {
        var today = new Date();
        var last = new Date(today.getTime() - (__days * 24 * 60 * 60 * 1000));
        resolve(last.toISOString()+"/"+today.toISOString())
    })
}

function __get_temporal_data(__url, __rid, __days) {
    var time;
    return new Promise((resolve, reject) => {
        var time;
        get_temporal_query_time_in_iso_8601_format(__days)
        .then(data => {
            time = data
            $.ajax({
                "url": __url,
                "async": true,
                "crossDomain": true,
                "processData": false,
                "method": 'POST',
                "headers": { "Content-Type": "application/json" },
                "data": JSON.stringify({
                    "id": __rid,
                    "time": time,
                    "TRelation": "during"
                }),
                // dataType: 'json',
                success: function (data) {
                    resolve(data)
                },
                error: function (error) {
                    reject(error)
                },
                timeout: 30000 // sets timeout to 30 seconds
            })
        })
        .catch(error => {
            _alertify("Error!!!", '<pre id="custom_alertbox">: ' + error["statusText"] + '</pre>');
            // console.log(error)
        })
    })
}

function _get_latest_data(_resource_id, _token) {
    //console.log(_token)
    _alertify("Getting Data...", get_spinner_html())
    $.ajax({
        "url": cat_conf['resoure_server_base_URL'] + "/search",
        "async": true,
        "processData": false,
        "crossDomain": true,
        "method": 'POST',
        "headers": { "token": _token, "Content-Type": "application/json" },
        "data": JSON.stringify({
            "id": _resource_id,
            "options": "latest"
        }),
        // dataType: 'json',
        success: function (data) {
            // alert("Success! \n"+data)
            // display_json_response_in_modal(data)
            _alertify("Success!!!", '<pre id="custom_alertbox">' + jsonPrettyHighlightToId(data) + '</pre>');
        },
        error: function (jqXHR, exception) {
            _alertify("Error!!!", '<pre id="custom_alertbox">: Please try some time later. Server is facing some problems at this moment.</pre>')
        },
        "timeout"   : 30000 // sets timeout to 30 seconds
    })
}

function _alertify(header_msg, body_msg) {
    alertify.alert(body_msg);
    $(".ajs-header").html(header_msg);
}

function display_latest_data(e, ele, _rid) {
    e.preventDefault();   // use this to NOT go to href site
    _alertify("Getting Data...", get_spinner_html())
    __get_latest_data(cat_conf['resoure_server_base_URL'] + "/search", _rid)
        .then(data => {
            _alertify("Success!!!", '<pre id="custom_alertbox">' + jsonPrettyHighlightToId(data) + '</pre>')
        })
        .catch(error => {
            _alertify("Error!!!", '<pre id="custom_alertbox">: ' + error["statusText"] + '</pre>');
            // console.log(error)
        })
}

function get_temporal_data_alert_html(){
    return `
        <input type="hidden" id="rid_in_hidden" name="rid_in_hidden" value="">
        <div class="form-group">
          <label for="data_keys">Select Y-Axis:</label>
          <select class="form-control" id="data_keys" onchange="update_temporal_data()">
          </select>
          <label for="duration">Select Duration:</label>
          <select class="form-control" id="duration" onchange="update_temporal_data()">
            <option value="7">1 Week</option>
            <option value="1">1 Day</option>
          </select>
        </div>
        <canvas id="custom_alertbox"></canvas>
    `
}

function update_temporal_data(){
    var _days = $( "#duration" ).val();
    var _rid = $('#rid_in_hidden').val()
    var __y_name = $( "#data_keys" ).val();
    __get_temporal_data(cat_conf['resoure_server_base_URL'] + "/search", _rid, _days)
        .then(data => {
            if(data.length == 0){
                // toast_alert("Data is empty", 'warning', '#1abc9c')
                alert("Data is empty")
            }else{
                var _x = []
                var _y = []
                var ctx = document.getElementById('custom_alertbox').getContext('2d');

                // get list of key in data
                var keys = Object.keys(data[0]);
                
                if(__y_name == undefined){
                    __y_name = keys[0]
                }
                for (var i = data.length - 1; i >= 0; i--) {
                    _x.push(formated_date(new Date(data[i]['LASTUPDATEDATETIME'])))
                    _y.push(parseInt(data[i][__y_name]));
                }

                window._chart = new Chart(ctx, get_conf('time', __y_name));
                window._chart.data.datasets=[]
                window._chart.data.datasets.push({
                        label: __y_name,
                        borderColor: 'red',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        fill: false,
                        cubicInterpolationMode: 'monotone'
                })
                // console.log(_x,_y)
                window._chart.data.labels=_x.reverse();
                window._chart.data.datasets.forEach((dataset) => {
                    // console.log(dataset);
                    // console.log(_y)
                    dataset.data=_y.reverse();
                });
                window._chart.update();
            }
        })
        .catch(error => {
            _alertify("Error!!!", '<pre id="custom_alertbox">: ' + error["statusText"] + '</pre>');
            console.log(error)
        })
}

function get_week_day(__day_num){
    if(__day_num == 0){
        return "Sun"
    }else if(__day_num == 1){
        return "Mon"
    }else if(__day_num == 2){
        return "Tue"
    }else if(__day_num == 3){
        return "Wed"
    }else if(__day_num == 4){
        return "Thu"
    }else if(__day_num == 5){
        return "Fri"
    }else if(__day_num == 6){
        return "Sat"
    }
}

function formated_date(__date){
    return get_week_day(__date.getDay()) + " | " + __date.getHours() + ":" + __date.getMinutes();
}

function display_temporal_data(e, ele, _rid, __y_name) {
    e.preventDefault();   // use this to NOT go to href site
    _alertify("Getting Data...", get_spinner_html())
    __get_temporal_data(cat_conf['resoure_server_base_URL'] + "/search", _rid, 7)
        .then(data => {
            if(data.length == 0){
                _alertify("Success!!!", '<pre id="custom_alertbox">Data is empty</pre>')
            }else{
                _alertify("Success!!!", get_temporal_data_alert_html())
                $('#rid_in_hidden').val(_rid);
                var _x = []
                var _y = []
                var ctx = document.getElementById('custom_alertbox').getContext('2d');


                // get list of key in data
                var keys = Object.keys(data[0]);
                for (var i =  0; i < keys.length; i++) {
                    $('#data_keys').append(`<option value="`+keys[i]+`">`+keys[i]+`</option>`);
                }

                if(__y_name == undefined){
                    __y_name = keys[0]
                }

                for (var i = 0; i < data.length; i++) {
                    _x.push(formated_date(new Date(data[i]['LASTUPDATEDATETIME'])))
                    _y.push(parseInt(data[i][__y_name]));
                }

                window._chart = new Chart(ctx, get_conf('time', __y_name));
                window._chart.data.datasets=[]
                window._chart.data.datasets.push({
                        label: __y_name,
                        borderColor: 'red',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        fill: false,
                        cubicInterpolationMode: 'monotone'
                })
                // console.log(_x,_y)
                window._chart.data.labels=_x.reverse();
                window._chart.data.datasets.forEach((dataset) => {
                    // console.log(dataset);
                    // console.log(_y)
                    dataset.data=_y.reverse();
                });
                window._chart.update();
            }
        })
        .catch(error => {
            _alertify("Error!!!", '<pre id="custom_alertbox">: ' + error["statusText"] + '</pre>');
            // console.log(error)
        })
}

function get_filtered_url(__filter_url) {
    if (__filter_url == `attribute-name=("")&attribute-value=((""))`) {
        return ""
    } else {
        return "&" + __filter_url
    }
}

function toast_alert(__msg, __msg_type, __bg_color) {
    $.toast({
        text: `<b class="toast_msg">` + __msg + `</b>`,
        position: 'mid-center',
        hideAfter: 1800,
        loader: false,  // Whether to show loader or not. True by default
        loaderBg: '#1abc9c',
        bgColor: __bg_color,
        showHideTransition: 'fade', // fade, slide or plain
        allowToastClose: false, // Boolean value true or false
        icon: __msg_type // Type of toast icon  
    })
}

function toast_alert_with_header(__header, __msg, __msg_type, __bg_color) {
    $.toast({
        heading: __header,
        text: `<b class="toast_msg">` + __msg + `</b>`,
        position: 'mid-center',
        hideAfter: 1800,
        loader: false,  // Whether to show loader or not. True by default
        loaderBg: '#1abc9c',
        bgColor: __bg_color,
        showHideTransition: 'fade', // fade, slide or plain
        allowToastClose: false, // Boolean value true or false
        icon: __msg_type // Type of toast icon  
    })
}

function reset_filter(__input_name) {
    $.each($(`input[name='` + __input_name + `']:checked`), function () {
        $(this).removeAttr("checked");
    });
    $('#ckbCheckAll').removeAttr("checked");
    var category = "";
    if (__input_name == "taglists") {
        category = "Tag"
    } else if (__input_name == "resource_server_group") {
        category = "Resource Server Group"
    } else if (__input_name == "provider") {
        category = "Provider"
    }
    console.log(get_selected_values_framed_url())
    var __filter_url = cat_conf['cat_base_URL']+"/search?" + get_selected_values_framed_url()
    $(".se-pre-con").fadeIn("slow");
    $.get(__filter_url, function (data, status) {
        markersLayer.clearLayers();
        data = JSON.parse(data)
        //console.log(data)
        for (var i = data.length - 1; i >= 0; i--) {
            // //console.log(data[i])
            if (data[i].hasOwnProperty('location')) {


                plotGeoJSONs(data[i]["location"]["value"]["geometry"], data[i]["id"], data[i], data[i]["resourceServerGroup"]["value"], data[i]["resourceId"]["value"]);
            } else if (data[i].hasOwnProperty('coverageRegion')) {


                plotGeoJSONs(data[i]["coverageRegion"]["value"]["geometry"], data[i]["id"], data[i], data[i]["resourceServerGroup"]["value"], data[i]["resourceId"]["value"]);
                //console.log("2")
            }
        }
            $(".se-pre-con").fadeOut("slow");
    });
  

    toast_alert(category + ' filter has been cleared', 'success', '#1abc9c')
}

function round_off(__arr, __decimal_places) {
    var x = 0;
    var len = __arr.length
    while (x < len) {
        __arr[x] = __arr[x].toFixed(__decimal_places);
        x++
    }
    return __arr;
}

function toast_alert_for_response_data_length(__data) {
    var len = __data.length;
    if (len == 0) {
        toast_alert('Zero items found for this query', 'warning', '#c0392b');
    } else {
        toast_alert('Found ' + len + ' items for this query', 'success', '#1abc9c');
    }
}

function showDetails() {
    //console.log("print this...")
    $('#_batch').hide();
    $('#point').show();
}

function get_selected_values_framed_url() {
    var value = get_selected_values_checkbox();
    var tags = value.tags;
    var rsg = value.rsg;
    var provider = value.provider;
    //console.log(tags, rsg , provider)

    var __filter_url = ""

    if (tags.length == 0 && rsg.length == 0 && provider.length == 0) {
        __filter_url = `attribute-name=("")&attribute-value=((""))`
    } else {
        // //console.log("else...")
        var _attr_names = get_api_encoded_attribute_names(tags, rsg, provider)
        // //console.log(_attr_names)
        var _attr_values = get_api_encoded_attribute_values(tags, rsg, provider)
        // //console.log(_attr_values)
        __filter_url = `attribute-name=` + _attr_names + `&attribute-value=` + _attr_values + get_geo_shape_url(geo_shape)
    }
    return __filter_url;
}

function get_geo_shape_url(__geo_shape) {
    var _url = ""
    if (__geo_shape != null) {
        if (__geo_shape['type'] == 'circle') {
            _url = "&lat=" + __geo_shape.value.center_point["lat"] + "&lon=" + __geo_shape.value.center_point["lng"] + "&radius=" + __geo_shape.value.radius
        } else if (__geo_shape['type'] == 'marker') {
            _url = "&lat=" + __geo_shape.value.center_point["lat"] + "&lon=" + __geo_shape.value.center_point["lng"]
        } else if (__geo_shape['type'] == 'polygon') {
            _url = "&geometry=polygon((" + __geo_shape.value.points + "," + __geo_shape.value.points[0] + "))&relation=within"
        } else if (__geo_shape['type'] == 'rectangle') {
            _url = "&bbox=" + __geo_shape.value.bbox_points + "&relation=within"
        } else if (__geo_shape['type'] == 'polyline') {
            _url = "&bbox=" + __geo_shape.value.bbox_points + "&relation=within"
        }
    }

    return _url;
}

function _get_security_based_latest_data_link(_resource_id, _resourceServerGroup, _rid, token) {
    // if(_resource_id=="rbccps.org/aa9d66a000d94a78895de8d4c0b3a67f3450e531/safetipin/safetipin/safetyIndex"){
    return `<button class="btn btn-secondary" onclick="_get_latest_data('` + _resource_id + `','` + token + `')">Get Full Latest Data</button>`
    // }else{
    //     return `<a href="#" class="data-modal"  onclick="display_latest_data(event, this, '`+_resource_id+`')">Get Latest Data</a>`
    // }
}


function _get_security_based_latest_data_link_for_map_view(_resource_id, _resourceServerGroup, _rid, token) {
    // if(_resource_id=="rbccps.org/aa9d66a000d94a78895de8d4c0b3a67f3450e531/safetipin/safetipin/safetyIndex"){
    return ``+get_bullets()+` <a id="get_full_latest_data_`+ resource_id_to_html_id(_resource_id) +`" onclick="_get_latest_data('` + _resource_id + `','` + token + `')">Get Full Latest Data</a>`
    // }else{
    //     return `<a href="#" class="data-modal"  onclick="display_latest_data(event, this, '`+_resource_id+`')">Get Latest Data</a>`
    // }
}

function perform_scroll(from_ele, to_ele){
    $(from_ele).animate({scrollTop: $(from_ele).scrollTop() + ($(to_ele).offset().top - $(from_ele).offset().top)});
}

function request_access_token(resource_id, resourceServerGroup, rid) {
    //console.log(resource_id)
    $.ajax({
        url: cat_conf['auth_base_URL'] + "/token",
        type: 'post',
        // dataType: 'json',
        contentType: 'text/plain',
        xhrFields: {
           withCredentials: true
        },
        // crossDomain: true,
        data: JSON.stringify({"request": { "resource-id": resource_id }}),
        success: function (data) {

            // For map view
            if(window.location.href.includes(`map`)){
                activate_point_mode(resource_id)
                $('#sidebar_token_space').html(
                    `<div id="map_token_`+ resource_id_to_html_id(resource_id) +`"><br><b style="font-size: 24px">Token:</b> <span style="font-size: 24px;word-break: break-all;" id="token_value_` + resource_id_to_html_id(resource_id) + `">` + data.token + `</span>`
                    + `&nbsp;&nbsp;&nbsp;<button class="btn copy-btn" onclick="copyToClipboard('` + resource_id_to_html_id(resource_id) + `')"> Copy Token <img class="secure_icon svg-white" src="../assets/img/icons/copy_white.svg"></button> <br> ` )
                if(!($(`#get_full_latest_data_`+ resource_id_to_html_id(resource_id)).is(':visible'))){
                    $(`#pop_up_`+ resource_id_to_html_id(resource_id)).append(`<br>` 
                    + _get_security_based_latest_data_link_for_map_view(resource_id, resourceServerGroup, rid, data.token))
                }

                _alertify("Success!!!", "Token received.<br>You are now authenticated to access the non-public data.")

                if (!($('#sidebar_token_space').is(':visible'))) {
                    $('#sidebar_token_space').toggle();
                }
            }
            // For list view
            else{
                // $('#token_section_'+resource_id_to_html_id(resource_id)).html($('#token_section_'+resource_id_to_html_id(resource_id)).html());
                $('#token_section_' + resource_id_to_html_id(resource_id)).html(
                    `<b>Token</b>: <span id="token_value_` + resource_id_to_html_id(resource_id) + `">` + data.token + `</span>`
                    + `&nbsp;&nbsp;&nbsp;<button class="btn copy-btn" onclick="copyToClipboard('` + resource_id_to_html_id(resource_id) + `')"> Copy Token <img class="secure_icon svg-white" src="../assets/img/icons/copy_white.svg"></button> <br> `
                    + _get_security_based_latest_data_link(resource_id, resourceServerGroup, rid, data.token))

                _alertify("Success!!!", "Token received.<br>You are now authenticated to access the non-public data.")
                // _alertify("Success!!!", "Token received: " + data.token)
                if (!($('#token_section_' + resource_id_to_html_id(resource_id)).is(':visible'))) {
                    $('#token_section_' + resource_id_to_html_id(resource_id)).toggle();
                }
            }



        },
        error: function (jqXHR, exception) {
            _alertify("Error", "Unauthorized access! Please contact the provider.")
        }
    });
}


function urlify(text) {
    var urlRegex = /(https?:\/\/[^"]+)/g;
    return text.replace(urlRegex, '<a href="$1" target="_blank" style="text-decoration:underline">$1</a>')
}

function jsonPrettyHighlightToId(jsonobj) {

    var json = JSON.stringify(jsonobj, undefined, 2);

    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'color: darkorange;';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'color: red;';
            } else {
                cls = 'color: green;';
            }
        } else if (/true|false/.test(match)) {
            cls = 'color: blue;';
        } else if (/null/.test(match)) {
            cls = 'color: magenta;';
        }
        // ////console.log(cls, match)
        return '<span style="' + cls + '">' + urlify(match) + '</span>';
    });
    // return urlify(json);
    return json;
}

function jsonPrettyHighlightToIdwithBR(jsonobj) {

    var json = JSON.stringify(jsonobj, undefined, 2);

    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // //console.log(json.replace(/\n/g, "<br />"))
    json = json.replace(/\n/g, "<br />")
    json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'color: darkorange;';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'color: red;';
            } else {
                cls = 'color: green;';
            }
        } else if (/true|false/.test(match)) {
            cls = 'color: blue;';
        } else if (/null/.test(match)) {
            cls = 'color: magenta;';
        }
        // ////console.log(cls, match)
        return '<span style="' + cls + '">' + urlify(match) + '</span>';
    });
    // return urlify(json);
    return json;
}


//ajax call to get resource-items using /search/catalogue/attribute for geoquery type=circle
// e.g. https://localhost:8443/search/catalogue/attribute?location={bounding-type=circle&lat=79.01234&long=78.33579&radius=1}
// function geoquery_circle(_lat,_lng, _radius) {
//       return new Promise(function(resolve, reject) {
//         // resourceClass =  $.unique(data.map(function (d) {
//         //         return d.accessInformation[0].accessVariables.resourceClass
//         //     }));
//          // markersLayer.clearLayers();

//            $.get("/search/catalogue/attribute?bounding-type=circle&lat="+ _lat +"&long="+ _lng +"&radius="+ _radius, function(data) {

//             data=JSON.parse(data)
//             for (var i = data.length - 1; i >= 0; i--) {
//                 if(data[i].hasOwnProperty('geoJsonLocation')){
//                     // myLayer.addData(data[i]['geoJsonLocation']);
//                     plotGeoJSONs(data[i]["geoJsonLocation"])
//                 }
//             }
//             // DATA=data
//             resolve(data);
//         });
//       });
// }

function settimeout(time_milli_seconds) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            sidebar.show();
        }, time_milli_seconds);
    });
}

function onEachFeature(feature, layer) {
    layer.bindPopup(feature.properties.name);
}

function stringToColour(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
          console.log(colour)
    return colour;
  }

function get_bullets(){
    return `&#9679;`
}

function plotGeoJSONs(geoJSONObject, _id, _json_object, _resourceServerGroup, _resourceId, _tags, _provider) {
    ////console.log(_resourceServerGroup)
    // ////console.log("plotting "+ geoJSONObject, _id, _id["id"])
    //console.log(geoJSONObject, _id, _json_object, _resourceServerGroup, _resourceId ,_tags , _provider)
    // _provider_data = _provider;
    // _tags_data = _tags;
    // _resourceServerGroup_data =_resourceServerGroup;
    // _geoJSONObject = geoJSONObject;
    // _resourceId_data = _resourceId;

    ////console.log(geoJSONObject)
    
    if(_json_object['id'].split("/").length == 5){
        
        if (geoJSONObject["type"] == "Polygon") {

            //console.log("Printing Polygon....")
            // color_count=color_count+1
            // var _color=getRandomColor()

            var div = $('div.info.legend');

            //console.log(_resourceServerGroup, div)
            var is_public = (_json_object['secure']||[]).length === 0;
            var is_secure = (_json_object['secure']||[]).length !== 0;;


            L.geoJSON(geoJSONObject, {
                style: {
                    fillColor:stringToColour(_resourceServerGroup),
                    weight: 2,
                    opacity: 1,
                    // color: 'white',
                    // dashArray: '3',
                    fillOpacity: 0.5
                },
                onEachFeature: function (feature, layer) {

                    layer.bindTooltip(`<div><p style="font-size:20px;"><strong>`+_resourceId+`</strong></p></div>`)
                    layer.on('mouseover', function(e) {
                        this.setStyle(highlightStyle);
                        console.log(this)
                        // this.bindTooltip(`<div><p style="font-size:20px;"><strong>`+_resourceId+`</strong></p></div>`)
                        this.bringToFront();
                        });
    
                        layer.on('mouseout', function(e) {
                        this.setStyle(defaultStyle);
                        this.bringToBack();
                        });
                    
                    layer.on('click', function (e) {

                        activate_point_mode(_id)

                    });
                    layer.bindPopup(`<div id="pop_up_`+ resource_id_to_html_id(_id) +`"><p class="text-center" style="padding-right:7.5px;"><img src='`+
                    ((is_public) ? "../assets/img/icons/green_unlock.svg" : "../assets/img/icons/red_lock.svg")
                    +`' class='img-fluid secure_icon'></p>`+get_bullets()+` <a href='#' class='data-modal'  onclick="display_latest_data(event, this, '` + _id + `')"> Get latest-data</a><br>
                      `+get_bullets()+` <a href="#"  class="data-modal" onclick="display_temporal_data(event, this, '`+_json_object.id+`')">Get Temporal Data</a><br>` +
                    ((is_secure) ? ` `+get_bullets()+` <a href='#' class='data-modal'  onclick="request_access_token('` + _json_object.id + `', '`+ _json_object["resourceServerGroup"]["value"] + `', '`+ _json_object["resourceId"]["value"] + `')">Request Access Token</a>` : ``
                    + `</div>`)
                    ).addTo(map);
                }

            }).addTo(markersLayer);

        }
        else if (geoJSONObject["type"] == "Point") {

            var is_public = (_json_object['secure']||[]).length === 0;
            // //console.log("Printing Point....")
            L.geoJSON(geoJSONObject, {
                pointToLayer: function (feature, latlng) {
                    // console.log(_resourceServerGroup)
                    // return L.marker(latlng, {icon: getOfficeIcon()});

                    // <a href='/catalogue/v1/items/"+plot_id+"'>Get Catalogue-item-details</a><br/>
                    var customPopup = `<div id="pop_up_`+ resource_id_to_html_id(_id) +`"><p class="text-center" style="padding-right:7.5px;"><img src='`+
                ((is_public) ? "../assets/img/icons/green_unlock.svg" : "../assets/img/icons/red_lock.svg")
                +`' class='img-fluid secure_icon'></p>`+get_bullets()+` <a href='#' class='data-modal'  onclick="display_latest_data(event, this, '` + _id + `')">Get latest-data</a>
        <br> `+get_bullets()+` <a href="#"  class="data-modal" onclick="display_temporal_data(event, this, '`+_json_object.id+`')">Get Temporal Data</a><br>` +
        `</div>`;
                    var _marker = L.marker(latlng, { icon: getMarkerIcon(_resourceServerGroup), riseOnHover: true }).addTo(map);
                    _marker.itemUUID = _id;
                    // console.log(_id,this,event)
                    //////console.log(_marker.itemUUID); _marker.bindPopup(customPopup) _marker.bindPopup(customPopup)
                    _marker.on('click', markerOnClick);
                    _marker.bindPopup(customPopup)
                    return _marker;
                },
                // filter: filter_byTags,
                // onEachFeature: onEachFeature
            }).addTo(markersLayer);
            // //console.log("22222222222")
        }
    }
}


function get_latest_data_url() {
    return cat_conf['resoure_server_base_URL'] + `/search`
}

function show_menu_icon() {
    $("#menu-bar-icon").show(500);
}

function hide_menu_icon() {
    $("#menu-bar-icon").hide(500);
}

function activate_batch_mode() {
    $("#point").hide();
    $("#_batch").show();
    ////console.log("batch mode")
    hide_menu_icon();
}

function activate_point_mode(_id) {
    // //console.log(1,_id)
    $("#_batch").hide();
    // //console.log(2,_id)
    // //console.log("called")
    show_details(_id)
    $("#point").show();
}

function resource_id_to_html_id(resource_id) {
    var replace_with = "_";
    return resource_id.replace(/\/|\.|\s|\(|\)|\<|\>|\{|\}|\,|\"|\'|\`|\*|\;|\+|\!|\#|\%|\^|\&|\=|\₹|\$|\@/g, replace_with)
}

function markerOnClick(e) {
    // var attributes = e.layer.properties;
    //////console.log(e.target.itemUUID)

    activate_point_mode(e.target.itemUUID);
    sidebar.show();
    // alert(e.target.itemUUID);
    // ////console.log(attributes);
    // do some stuff…
}


function getMapDefaultViewLatLng() {
    return cat_conf['map_default_view_lat_lng']
}

function getMarkerIconOptions(__rsg) {
    return {
        iconUrl: legends[__rsg],
        // shadowUrl: 'leaf-shadow.png',

        iconSize: [38, 95], // size of the icon
        iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
        popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
        shadowSize: [41, 41]  // size of the shadow
    }
}

function getOfficeIcon() {
    var officeIcon = L.icon({
        iconUrl: 'https://image.flaticon.com/icons/svg/167/167707.svg',
        // shadowUrl: 'leaf-shadow.png',

        iconSize: [38, 95], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    return officeIcon;
}


function getMarkerIcon(__rsg) {
    return L.icon(getMarkerIconOptions(__rsg.split(cat_conf['resource_server_group_head'])[1]));
}


function get_internal_apis_endpoint(){
    var arr = cat_conf['cat_base_URL'].split("/")
    arr.pop()
    return arr.join("/")
}

function getFooterContent(){
    return `<p>&copy; 2019 <a href="https://iudx.org.in" target="_blank">IUDX </a></p>`
    // return `<p>&copy; 2019 <a href="https://iudx.org.in" target="_blank">IUDX </a> | Read the  <a href="`+ cat_conf['api_docs_link'] +`" target="_blank">Doc</a> <br> ` + get_icon_attribution_html("list_icon_attr") + `</p>`
}

function get_selected_values_checkbox() {
    var _tags = [];
    var _rsg = [];
    var _pr = [];

    $.each($("input[name='taglists']:checked"), function () {
        _tags.push($(this).val());
    });  

    $.each($("input[name='resource_server_group']:checked"), function () {
        _rsg.push($(this).val());
    });

    $.each($("input[name='provider']:checked"), function () {
        _pr.push($(this).val());
    });
    //alert("My taglists are: " + _tags.join(", ")+"and My resource group are:" +_rsg.join(", "));

    return values =
        {
            "tags": _tags,
            "rsg": _rsg,
            "provider": _pr
        }

}

$(document).ready(function () {
    if(window.location.href.split(window.origin)[1]!="/"){
        $("#smart_city_link").html(cat_conf['smart_city_name'])
        $("#smart_city_link").attr('href', cat_conf['smart_city_url'])
        $("#smart_iudx_city_logo").attr('src', cat_conf['smart_city_iudx_logo'])
    }else{
        $("#smartcity_name").html(" IUDX | Indian Urban Data Exchange")
    }
});
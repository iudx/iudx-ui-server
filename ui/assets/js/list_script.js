/*************************************************GLOBAL VARIABLES START*********************************************/
var tags_set=[]
var rsg_set=[]
var provider_set=[]
var filters="(id,resourceServerGroup,itemDescription,onboardedBy,accessInformation,resourceId,tags,secure)"

/*************************************************GLOBAL VARIABLES END***********************************************/


/*************************************************FUNCTION DECLARATIONS START*********************************************/




function display_swagger_ui(_openapi_url){
	$(".section").fadeOut(200);
	$("body").css("background-image","none");
	$("#swagger_section").fadeIn(1500);
	const ui = SwaggerUIBundle({
	//url: "https://petstore.swagger.io/v2/swagger.json",
	url: _openapi_url,
	dom_id: '#swagger_ui',
	deepLinking: true,
	presets: [
	  SwaggerUIBundle.presets.apis,
	  SwaggerUIStandalonePreset
	],
	plugins: [
	  SwaggerUIBundle.plugins.DownloadUrl
	],
	layout: "StandaloneLayout"
	})
}

function display_search_section(){
	$(".section").fadeOut(200);
	$("body").css("background-image","none");
	$("#search_section").fadeIn(1500);
}

/*
function _get_item_count(__url){
    return new Promise((resolve, reject) => {
        $.ajax({
            "url": __url,
            "async": true,
            "crossDomain": true,
            "processData": false,
            "method": 'GET',
            // dataType: 'json',
            success: function (data) {
                resolve(get_item_count(JSON.parse(data)))
            },
            error: function (error) {
                reject(error)
            },
            timeout: 30000 // sets timeout to 30 seconds
        })
    })
}
*/

function get_items(_attr_name,_attr_value){
	var _temp_a_v;

	if(is_attr_empty(_attr_name,_attr_value)){
		return;
	
	}

	_temp_a_v = replace_whiteSpace(_attr_value);

	if(!first_get_item_call_done){
		first_get_item_call_done=true;
		display_search_section();
	}

	// var _temp_a_v = _attr_value

	if(_attr_name=="resourceServerGroup"){
		_attr_value=cat_conf['resource_server_group_head']+_attr_value
	}else if(_attr_name=="provider"){
		_attr_value=cat_conf['provider_head']+_attr_value
	}
	
	$(".se-pre-con").fadeIn("slow");
	
	$.get(cat_conf["cat_base_URL"] + "/search?attribute-name=("+_attr_name+")&attribute-value=(("+_temp_a_v+"))", function(data) {
            // $("#searched_items").text(data);
		data=JSON.parse(data)
		set_data_globally(data);
		$("#retrieved_items_count").html("About " + get_item_count(data) + " results for " + _temp_a_v + " (Attribute: " + _attr_name + ") | Go to <a href='/c/map'>Map View</a>/<a href='/status'>Status View</a>/<a href='/c'>HomePage</a>/<a href='https://www.iudx.org.in/overview-of-iudx/'>Overview Of IUDX</a>");
		$("#searched_items").html(`<div class="container"></div>`);
		for (var i = 0; i < data.length; i++) {
			$("#searched_items").append(json_to_htmlcard(data[i]));
		}
		populate_pagination_section();
			
		$(".se-pre-con").fadeOut("slow");
        });

	// $( "#_value" ).autocomplete({
	//       source: seen_tags_set
	// });

	// $( "#value" ).autocomplete({
	//       source: seen_tags_set
	// });
}

function set_attr_value(__attr_name,__attr_value) {
    // ////console.log("v:",$( "#value" ).is(':visible'))
    // ////console.log("_v:",$( "#_value" ).is(':visible'))
    if($( "#value" ).is(':visible')){
            $( "#value" ).autocomplete({
                source: __attr_value,
                select: function( event, ui ) {
                    get_items(__attr_name, ui["item"]['label'])
                }
                // ,
                // select: function (e, ui) {
                //  alert("selected!", e);
                // },
                // change: function (e, ui) {
                //  alert("changed!", e, ui);
                // }
            });
        }

    if($( "#_value" ).is(':visible')){
			$( "#_value" ).autocomplete({
            source: __attr_value,
            select: function( event, ui ) {
				console.log(event,ui)
                get_items(__attr_name, ui["item"]['label'])
            }
        });
    }
}


function get_horizontal_spaces(space_count){
	var horizontal_space_str=""
	for (var i = space_count.length - 1; i >= 0; i--) {
		horizontal_space_str+="&nbsp;"
	}
	return horizontal_space_str;
}

function display_json_response_in_modal(json_obj){
		$.sweetAlert({
		  content: jsonPrettyHighlightToId(json_obj),
		  // $.sweetModal.ICON_SUCCESS
		  // $.sweetModal.ICON_WARNING
		  // $.sweetModal.ICON_ERROR
		  icon: $.sweetModal.ICON_SUCCESS

		});
}

function display_swagger_ui(_openapi_url){
    $(".section").fadeOut(200);
    $("body").css("background-image","none");
    $("#swagger_section").fadeIn(1500);
    const ui = SwaggerUIBundle({
    //url: "https://petstore.swagger.io/v2/swagger.json",
    url: _openapi_url,
    dom_id: '#swagger_ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
    })
}



/*************************************************FUNCTION DECLARATIONS START*********************************************/








/*************************************************EVENT BINDINGS START*********************************************/



/*************************************************EVENT BINDINGS END*********************************************/









/********************************************************************************************/



/********************************************************************************************/
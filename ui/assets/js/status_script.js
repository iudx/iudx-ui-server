function get_items(_attr_name,_attr_value){
	if(is_attr_empty(_attr_name,_attr_value)){
		return;
	}

	if(!first_get_item_call_done){
		first_get_item_call_done=true;
		display_search_section();
	}

	var _temp_a_v = _attr_value

	if(_attr_name=="resourceServerGroup"){
		_attr_value=cat_conf['resource_server_group_head']+_attr_value
	}else if(_attr_name=="provider"){
		_attr_value=cat_conf['provider_head']+_attr_value
	}
	
	$(".se-pre-con").fadeIn("slow");
	

	

	
	$.get(cat_conf['cat_base_URL']+"/search?attribute-name=("+_attr_name+")&attribute-value=("+_attr_value+")", function(data) {
            // $("#searched_items").text(data);
		data=JSON.parse(data)
		set_data_globally(data);
		$("#retrieved_items_count").html("About " + get_item_count(data) + " results for " + _temp_a_v + " (Attribute: " + _attr_name + ") | <a href='/map'>Go to Map View</a>");
		$("#searched_items").html("");
		for (var i = 0; i < data.length; i++) {
			$("#searched_items").append(json_to_htmlcard(data[i]));
		}
		populate_pagination_section();
			
		console.log(get_item_count(data))

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
                get_items(__attr_name, ui["item"]['label'])
            }
        });
    }
}
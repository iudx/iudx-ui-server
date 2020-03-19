/*----------------------------------------------
 For Auth set policy & manage groups
-----------------------------------------------*/
var row_count = 0;
var row_count_grp = 0;


$(document).ready(function () {
	getPolicy();
	getGroups();
});
// SET POLICY RULES

const $tableID = $('#table');
const $BTN = $('#export-btn');
const $EXPORT = $('#export');

//For removing rows from the table on clicking Remove button
$tableID.on('click', '.table-remove', function () {

	$(this).parents('tr').detach();
    row_count = row_count - 1;
    console.log(row_count)
    toast_alert('Removed successfully!!','success','#248c5a')
});

// A few jQuery helpers for exporting only
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;

$BTN.on('click', () => {

	const $rows = $tableID.find('tr:not(:hidden)');
	const headers = [];
	const data = [];
	var str = "";

	// Get the headers (add special header logic here)
	$($rows.shift()).find('th').each(function () {

		headers.push($(this).text().toLowerCase());
	});



	// Turn all existing rows into a loopable array
	$rows.each(function () {
		const $td = $(this).find('td');
		const h = {};

		// Use the headers from earlier to name our hash keys
		headers.forEach((header, i) => {
			// console.log($td.eq(i).innerText)
			header = header.trim();
			if (header === "")
				header = i;

			// console.log(header,$td.eq(i).text())

			h[header] = $td.eq(i).text();
		});

		data.push(h);
		console.log(data);
	});

	var str1 = "";

	// Output the result
	// $EXPORT.text(JSON.stringify(data));
	var a = [];
	var b = [];

	for (var i = 0; i <= data.length - 1; i++) {

		 console.log(data[i]);
		tokenVal = get_token_validiy(i)
		// console.log("Gpot",tokenVal,typeof (tokenVal));
		// console.log(tokenVal === "undefined")//false

		r = data[i]["email-id"].trim() + " can access " + data[i]["resource-id"].trim();
		// console.log(tokenVal)
		tokenPeriod = $('#dropdownValue_' + i).text()
		if (tokenVal) {
			// console.log("i m here")
			r += " for " + tokenVal.trim() + " " + tokenPeriod.trim();
			// console.log(r)
		}

		if (data[i]["condition"]) {
			r += " if " + data[i]["condition"].trim();
			// console.log(r)
		}
		// console.log(r)
		b.push(r);
	}
	// console.log(b)
	str1 = b.join(";");

	 console.log(str1)
	setPolicy(str1);
	// getPolicy()
	$EXPORT.text(str1);
	// console.log("a = ",a)
	// console.log("b = ",b)

});

// Add & Manage Consumer Groups

const $tableGrpID = $('#consumer-table');
const $BTN_ADD_GRP = $('#export-btn-add-grp');
const $BTN_GET_GRP = $('#export-btn-get-grp');
const $EXPORT_GRP = $('#export-grp');

$tableGrpID.on('click', '.table-remove', function () {
	// console.log($(this).parents('tr')[0].innerText);
	var str = $(this).parents('tr')[0].innerText;
	//str.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
	var stringArray = str.split(/(\s+)/);

	// console.log(stringArray)
	grp = stringArray[2];
	email = stringArray[0]

	deleteGroups(grp, email);
	$(this).parents('tr').detach();
    row_count_grp = row_count_grp - 1;
    
});

// A few jQuery helpers for exporting only
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;

$BTN_ADD_GRP.on('click', () => {

	const $rows = $tableGrpID.find('tr:not(:hidden)');
	const headers_grp = [];
	const data_grp = [];
	var str = "";

	// Get the headers (add special header logic here)
	$($rows.shift()).find('th').each(function () {

		headers_grp.push($(this).text().toLowerCase());
	});

	// Turn all existing rows into a loopable array
	$rows.each(function () {
		const $td = $(this).find('td');
		const h = {};

		// Use the headers from earlier to name our hash keys
		headers_grp.forEach((header, i) => {
			// console.log($td.eq(i).innerText)
			header = header.trim();
			if (header === "")
				header = i;

			// console.log(header, $td.eq(i).text())

			h[header] = $td.eq(i).text();
		});

		data_grp.push(h);
		// console.log(data_grp);
	});

	var str1 = "";


	for (var i = 0; i <= data_grp.length - 1; i++) {

		// console.log(data_grp[i]);
		validity = get_validity(i)
		// $('#txtBoxGrp_' + i).val()
		// console.log("Gpot",tokenVal,typeof (tokenVal));
		// console.log(tokenVal === "undefined")//false

		email = data_grp[i]["email-id"].trim();
		grp = data_grp[i]["group"].trim();

		// console.log(email, grp, validity)

		str = email + "," + grp + "," + validity;

	}

	setGroups(grp, email, validity);
	// getPolicy()
	$EXPORT_GRP.text("Added group " + grp + " for consumer email " + email + " valid-till :" + validity);

});

$BTN_GET_GRP.on('click', () => {

	const $rows = $tableGrpID.find('tr:not(:hidden)');
	const headers = [];
	const data = [];
	var str = "";

	// Get the headers (add special header logic here)
	$($rows.shift()).find('th').each(function () {

		headers.push($(this).text().toLowerCase());
	});

	// Turn all existing rows into a loopable array
	$rows.each(function () {
		const $td = $(this).find('td');
		const h = {};

		// Use the headers from earlier to name our hash keys
		headers.forEach((header, i) => {
			// console.log($td.eq(i).innerText)
			header = header.trim();
			if (header === "")
				header = i;

			// console.log(header,$td.eq(i).text())

			h[header] = $td.eq(i).text();
		});

		data.push(h);
		//console.log(data);
	});

	var str1 = "";


	var a = [];
	var b = [];

	for (var i = 0; i <= data.length - 1; i++) {

		// console.log(data[i]);
		validity = get_validity(i)
		// $('#txtBoxGrp_' + i).val()
		// console.log("Gpot",tokenVal,typeof (tokenVal));
		// console.log(tokenVal === "undefined")//false

		email = data[i]["email-id"].trim();
		grp = data[i]["group"].trim();
		console.log(email, grp, validity)


		// if (tokenVal) {
		// console.log("i m here")
		// 	r += " for " + tokenVal.trim() + " " + tokenPeriod.trim();
		// 	console.log(r)
		// }

		// if (data[i]["condition"]){
		// 	r += " if " + data[i]["condition"].trim();
		// 	console.log(r)
		// }
		str = email + "," + grp + "," + validity;

	}

	getGroups();
	// getPolicy()
	// $EXPORT_GRP.text("Added group "+grp+ " for consumer email " +email + " valid-till :"+validity);
	// $EXPORT_GRP.text("Groups are::: " + grp);
});


/* ---------------------------------------------------
    Auth Section starts here-------
----------------------------------------------------- */
/*--------------------------------------------------------
//For set Policy Rules:::::::
--------------------------------------------------------*/
function setPolicy(rule) {

    console.log(rule);
    var json_rule = { "policy": rule };

    $.ajax({

        url: cat_conf['auth_base_URL']+'/acl/set',

        type: 'POST',

        //      dataType: "json",
        contentType: 'application/json',
        data: JSON.stringify(json_rule),
        success: function (data, textStatus, jQxhr) {
            // alert("Success! \nPolicies Set ")
            toast_alert('Policies Set!!','success','#248c5a')
            // console.log(data, textStatus, jQxhr);
        },
        error: function (jqXhr, StatusText, errorThrown) {
            // console.log(errorThrown, jqXhr, StatusText);
            toast_alert('Policies Not Set','error','#248c5a')

        }
    });
   }


function addPolicy() {


    // getPolicy();
    console.log("Adding ", row_count);

    $("#tbody").append(`
            <tr>
                  
                  <td class="pt-3-half border-right" ><input style="border:none" type="text" contenteditable="true" placeholder="&lt;consumer-email(s)&gt;"></div></td>
                  <td class="pt-3-half no-border">Can access</td>
                  <td class="pt-3-half border-right"><input style="border:none" type="text" contenteditable="true" placeholder="&lt;resource-Id(s)&gt;"></div></td>
                  <td class="pt-3-half no-border">For</td>
                  <td class="pt-3-half border-right">
                  <div class="btn-group">
                  <input id="txtBox_`+ row_count + `" type="number" placeholder="Validity">
                  <button id="dropdownValue_`+ row_count + `" type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">minutes</button>
                  <ul id="myDropdown_`+ row_count + `" class="dropdown-menu" role="menu">
                    <li>seconds</li>
                    <li>minutes</li>
                    <li>hours</li>
                    <li>days</li>
                    <li>weeks</sli>
                    <li>months</li>
                    <li>years</li>
                    <li>none</li>
                  </ul>
                </div></td>
                  <td class="pt-3-half no-border">If</td>
                  <td class="pt-3-half border-right"><input style="border:none" type="text" contenteditable="true" placeholder="condition"></div></td>
                  <td><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0">Remove</button></span>
                  </td>
            </tr>
        `);

    get_token_validiy(row_count);
    row_count = row_count + 1;
    console.log(row_count)
}

function getPolicy() {

        $.ajax({

            url: cat_conf['auth_base_URL']+'/acl',
    
            type: 'POST',
    
            //      dataType: "json",
            contentType: 'application/json',
            
            success: function (data, textStatus, jQxhr) {
                
                // console.log(data, textStatus, jQxhr);
                 policy = [];
                 console.log(data)
                policies_arr = data.policy.split(";");
                  console.log(policies_arr)
                $("#tbody").html("")
                for (i = 0; i < policies_arr.length; i++) {
                    // console.log(policies_arr[i])
       
                    $("#tbody").append(parse_p(policies_arr[i]));
                    get_token_validiy(i);
       
                }
                
            },
            // error: function (jqXhr, StatusText, errorThrown) {
            //     // console.log(errorThrown, jqXhr, StatusText);
            //     alert("Error!\n" + StatusText)
    
            // }
        });
    
}

function parse_p(_data) {
     console.log(_data)
    var arr_res = [];
    _resVal = _data.split("can access");
    // console.log(_resVal[0]);
    var rc = row_count
    row_count = row_count + 1
    // const str2= "";
    if (_resVal[1].includes("if") && !(_resVal[1].includes("for"))) {
        // console.log("Here")
        _resVal1 = _resVal[1].split("if")
        arr_res.push(_resVal[0]);
        arr_res.push(_resVal1[0]);
        // console.log(arr_res[1])
        const str = `
                      
        <td class="pt-3-half border-right" contenteditable="true">`+ arr_res[0] + `</td>
        <td class="pt-3-half no-border">Can access</td>
        <td class="pt-3-half border-right" contenteditable="true">`+ arr_res[1] + `</td>
        
        `;
        str2 = for_if_condition(_resVal, rc);
        // console.log(str2)
        return `
        <tr> `+ str + ` ` + str2 + `
        </tr>
        `;
    }
    else {
        _resVal1 = _resVal[1].split("for");
        arr_res.push(_resVal[0])
        arr_res.push(_resVal1[0])
        // console.log(_resVal1[0]);
        const str = `
                      
        <td class="pt-3-half border-right" contenteditable="true">`+ arr_res[0] + `</td>
        <td class="pt-3-half no-border">Can access</td>
        <td class="pt-3-half border-right" contenteditable="true">`+ arr_res[1] + `</td>
        
        `;
        str2 = for_if_condition(_resVal, rc);
        // console.log(str2)
        return `
        <tr> `+ str + ` ` + str2 + `
        
        
        </tr>
        `;

    }
}

function getDropdown(_data, rc) {
    //console.log(_data[1],rc)
    var num = parseInt(_data[1])
    // console.log(num)

    return `
        <td class="pt-3-half border-right" contenteditable="true">
                  <div class="btn-group">
                        <input id="txtBox_`+ rc + `" value="` + num + `" type="number" placeholder="Validity">
                        <button id="dropdownValue_`+ rc + `" type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">` + _data[2] + `</button>
                        <ul  id="myDropdown_`+ rc + `" class="dropdown-menu" role="menu">
                            <li>seconds</li>
                            <li>minutes</li>
                            <li>hours</li>
                            <li>days</li>
                            <li>weeks</sli>
                            <li>months</li>
                            <li>years</li>
                            <li>none</li>
                        </ul>
                    </div>
        </td>
        `;
}

function for_if_condition(_res, _rc) {
    // console.log(_res[1], _rc)
    //BOTH 'for' and 'if are present
    _arr_res = [];

    if (_res[1].includes("for") && _res[1].includes("if")) {
        _res2 = _res[1].split("for");
        _res3 = _res2[1].split("if");
        _res4 = _res3[0].split(" ");
        _arr_res.push(_res3[1]);
        // console.log(_res4)
        // console.log(_res3)
        return `
            <td class="pt-3-half no-border">For</td> 
                      `+ getDropdown(_res4, _rc) + `
                      <td class="pt-3-half no-border">If</td>
                      <td class="pt-3-half border-right" contenteditable="true">`+ _arr_res[0] + `</td>
                      <td>  <span class="table-remove"><button type="button"
                             class="btn btn-danger btn-rounded btn-sm my-0">Remove</button></span>
                      </td>
                      `;

    }

    //Only 'for' is present
    if (_res[1].includes("for") && !(_res[1].includes("if"))) {
        _res2 = _res[1].split("for");

        _res3 = _res2[1].split(" ")

        //console.log($("txtBox_ + _rc").val("_res2[1]"));
        return `
            <td class="pt-3-half no-border">For</td> 
                      `+ getDropdown(_res3, _rc) + `
                      <td class="pt-3-half no-border">If</td>
                      <td class="pt-3-half border-right" contenteditable="true"></td>
                      <td><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0">Remove</button></span>
                      </td>
                      `;
    }
    //Only  'if' is present
    if (_res[1].includes("if") && !(_res[1].includes("for"))) {
        _res2 = _res[1].split("if");
        // console.log(_res2)
        _arr_res.push(_res2[1])

        return `
            <td class="pt-3-half no-border">For</td> 
                      `+ getDropdown(0, _rc) + `
                      <td class="pt-3-half no-border">If</td>
                      <td class="pt-3-half border-right" contenteditable="true">`+ _arr_res[0] + `</td>
                      <td>  <span class="table-remove"><button type="button"
                             class="btn btn-danger btn-rounded btn-sm my-0">Remove</button></span>
                      </td>
                      `;

    }

    //Both 'for' & ''if are not present
    if (!(_res[1].includes("for")) && !_res[1].includes("if")) {
        return `
            <td class="pt-3-half no-border">For</td>
                      `+ getDropdown(0, _rc) + `
                        <td class="pt-3-half no-border">If</td>
                      <td class="pt-3-half border-right" contenteditable="true"></td>
                      <td>  <span class="table-remove"><button type="button"
                             class="btn btn-danger btn-rounded btn-sm my-0">Remove</button></span>
                      </td>
                      `;
    }

}

/*------------------------------------------------
FOr Managing & Setting Groups
-------------------------------------------------*/

function addGroups() {

    $("#plus_add").click(function(){
        $("#step-6-card").css("position", "fixed");
      });
    // getGroups();
    // console.log("Adding ", row_count_grp);

    $("#tbody_grp").append(`
		<tr>
			  
			  <td class="pt-3-half border-right" ><input style="border:none" type="text" contenteditable="true" placeholder="&lt;consumer-email(s)&gt;"></div></td>
			  <td class="pt-3-half border-right"><input style="border:none" type="text" contenteditable="true" placeholder="&lt;group&gt;"></div></td>
			 
			  <td class="pt-3-half no-border">For</td>
			  <td class="pt-3-half border-right">
			  <div class="btn-group">
			  <input id="txtBoxGrp_`+ row_count_grp + `" type="number" placeholder="Validity">
			  <button id="dropdownGrpValue_`+ row_count_grp + `" type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">seconds</button>
			  </div></td>
			  <td><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0">Remove</button></span>
			  </td>
		</tr>
	`);
    get_validity(row_count_grp);
    row_count_grp = row_count_grp + 1;

}

function setGroups(grp, email, validity) {

    // console.log(grp, email, validity);
    var json_rule = { "group": grp, "consumer": email, "valid-till": validity };
    $.ajax({

        url: cat_conf['auth_base_URL']+'/group/add',

        type: 'POST',

        //      dataType: "json",
        contentType: 'application/json',
        data: JSON.stringify(json_rule),
        success: function (data, textStatus, jQxhr) {
            //alert("Success! \nGroups Added successfully ")
            toast_alert( 'Groups Added successfully', 'success', '#248c5a')
            // console.log(data, textStatus, jQxhr);
        },
        error: function (jqXhr, StatusText, errorThrown) {
            console.log(errorThrown, jqXhr, StatusText);
            // alert("Error!\n" + StatusText)
            toast_alert(  'Error!\n '  , 'error','#dc3545');

        }
    });

}

function getGroups() {

    //json_rule = {"vgroup":"grp"}

    $.ajax({

        url: cat_conf['auth_base_URL']+'/group/list',

        type: 'POST',

        contentType: 'application/json',
        //data: JSON.stringify(json_rule),
        success: function (data, textStatus, jQxhr) {
            // alert("Success! \nPolicies Set ")
            // console.log(data, textStatus, jQxhr);

            for (i = 0; i < data.length; i++) {
                // console.log(data[i]["valid-till"])
                //var date = new Date(data[i]["valid-till"]); 
                //var milliseconds = date.getTime();
                // console.log(milliseconds)
                // var myDate = Date.parse(data[i]["valid-till"]);
                // console.log(myDate)
                // var seconds = myDate / 1000;
                // console.log(seconds)

                //var arr= data[i].consumer
                //console.log(Object.keys(data[i]))


                // $("tbody_grp").html("")
                $("#tbody_grp").append(`
		<tr>
			  
			  <td class="pt-3-half border-right" contenteditable="true">`+ data[i].consumer + `</td>
			  <td class="pt-3-half border-right" contenteditable="true">`+ data[i].group + `</td>
			 
			  <td class="pt-3-half no-border">For </td>
              <td class="pt-3-half border-right">
			  <div class="btn-group">
			  <input id="txtBoxGrp_`+ row_count_grp + `" type="" value = "` + data[i]["valid-till"] + ` "placeholder="Validity" readonly="readonly">
			  
			  </div></td>
			  <td><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0">Remove</button></span>
			  </td>
		</tr>
	`);
                row_count_grp = row_count_grp + 1;
            }
        },
        error: function (jqXhr, StatusText, errorThrown) {
            // console.log(errorThrown, jqXhr, StatusText);
            toast_alert(  'Error!\n '  , 'error','#dc3545');

        }
    });



}

function deleteGroups(grp, email) {

    json_rule = { "group": grp, "consumer": email }
    $.ajax({
        url: cat_conf['auth_base_URL']+'/group/delete',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(json_rule),
        success: function (data, textStatus, jQxhr) {
            // alert("Success! \nGroup(s) Deleted successfully ")
            toast_alert( 'Group(s) Deleted successfully', 'success', '##dc3545');
            // console.log(data, textStatus, jQxhr);
            $(this).parents('tr').detach();
        },
        error: function (jqXhr, StatusText, errorThrown) {
            // console.log(errorThrown, jqXhr, StatusText);
            alert("Error!\n" + errorThrown)
            toast_alert(  'Error!\n '+ errorThrown  , 'error','#dc3545');

        }

    });
    row_count = row_count - 1;
}

function get_validity(row_num_grp) {
    // console.log("Counting" + row_num_grp)
    // console.log($('#txtBoxGrp_' + row_num_grp).val())
    return $('#txtBoxGrp_' + row_num_grp).val()

}

function get_token_validiy(row_num) {



    $(document).on("click", "#myDropdown_" + row_num + " li", function () {
        // alert($(this).text());
        //row_num = row_num + 1; 
        // console.log("Counting" + row_num)

        var selectedValue = $(this).text();
        // console.log(selectedValue)
        $('#dropdownValue_' + row_num).text(selectedValue)


    })

    // console.log($('#dropdownValue_' + row_num +':selected').text())
    // return $("#txtBox_" + row_num).val() + " " + $('#dropdownValue_' + row_num).text();
    return $("#txtBox_" + row_num).val()
}

// Functions for Access Token & Get Data from Token in Consumer


function request_access_token() {
    // console.log("Rohina")

    // var body = {"resource-id":"rbccps.org/aa9d66a000d94a78895de8d4c0b3a67f3450e531/safetipin/safetipin/safetyIndex"};
    var body = { "request": { "id": $("#r-id").val() } };

    if ($("#api").val().trim() !== "")
        body.api = $("#api").val().trim();

    if ($("#methods").val().trim() !== "")
        body.methods = $("#methods").val().trim().split(",");

    // console.log("Sending", body);
    if ($("#expiration").val().trim() !== "")
        body.expiration = $("#expiration").val().trim();

    // console.log("Sending", body);


    $.ajax({
        url:  cat_conf['auth_base_URL']+'/token',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(body),
        success: function (data) {
            // console.log(data)
            if (data["server-token"]) {
                alert("Success! \nToken received: " + data.token + "\n" + "Server token: " + data["server-token"][body["resource-id"].split("/")[2]]);
            }
            else {
                alert("Success! \nToken received: " + data.token + "\n");
            }
            //console.log(data["server-token"][body["resource-id"].split("/")[2]]) 
            var tokenList = { 'one': 1, 'two': 2, 'three': 3 };

            // Put the object into storage

            localStorage.setItem('tokenList', JSON.stringify(data.token));

            // Retrieve the object from storage
            var retrievedObject = localStorage.getItem('tokenList');
            for (var i = 0, len = localStorage.length; i < len; ++i) {
                // console.log(localStorage.getItem(localStorage.key(i)));
            }

            // console.log('retrievedObject: ', JSON.parse(retrievedObject));
            //   localStorage.TokenList = (JSON.stringify(data));
            $('#token_value').val(data.access_token);
            // console.log($('#token_value').val())

        },
        error: function (jqXHR, exception) {
            // alert("Unauthorized access! Please get a token.");
            toast_alert(  'Unauthorized access! Please get a token.'  , 'error','#dc3545');
            
        }
    });
}

function get_data_from_token() {


    _token = $("#token_value").val();
    // console.log(_token)

    $.ajax({
        url: "https://pune.iudx.org.in/api/1.0.0/resource/search/safetypin/18.56581555/73.77567708/10",
        type: 'GET',
        headers: { "token": "_token" },
        success: function (data) {
            console.log(JSON.parse(data));

            alert("Success! \nGet Data: " + data)


        },
        error: function (jqXHR, exception) {
            alert("ERR", exception)
        }
    });
}

function audit_tokens(__time){
    $.ajax({
        // url: cat_conf['auth_base_URL']+'/audit/tokens',
        url:'https://api.myjson.com/bins/afncy',
        // type: 'POST',
        type:'GET',
        contentType: 'application/json',
        // data: JSON.stringify({"hours": __time}),
        success: function (data, textStatus, jQxhr) {
             alert("Success! \nGroup(s) Deleted successfully ")
            //toast_alert( 'Group(s) Deleted successfully', 'success', '##dc3545');
            console.log(data, textStatus, jQxhr);
            $('#display-audit-tokens').html(displayAuditTokens(data));
            
        },
        error: function (jqXhr, StatusText, errorThrown) {
            // console.log(errorThrown, jqXhr, StatusText);
            alert("Error!\n" + errorThrown)

        }

    });
}

$("#audit_submit").click(function(){
    var _time= $("#audit_input").val();
    audit_tokens(_time);
});

function displayAuditTokens(__data){
    console.log(__data)
    console.log(__data.length);
    // for(index=0;index<__data.length;index++)
    console.log(__data['as-consumer'])
    // console.log(__data['as-producer']['0'])
    // $("#audit").hide();
    return `
   
    <div class="card" >
  <div class="card-header font-weight-bold text-uppercase">
    As Consumer
  </div>
  <table class="card-table table">
    
    <tbody>
      <tr>
        <td>token-issued-at:</td>
        <td>`+__data["as-consumer"]["0"]["token-issued-at"]+`</td>
      </tr>
      <tr>
      <td>introspected:</td>
      <td>`+__data["as-consumer"]["0"]["introspected"]+`</td>
    </tr>
    <tr>
    <td>revoked:</td>
    <td>`+__data["as-consumer"]["0"]["revoked"]+`</td>
  </tr>
  <tr>
    <td>expiry:</td>
    <td>`+__data["as-consumer"]["0"]["expiry"]+`</td>
  </tr>
  <tr>
    <td>certificate-serial-number:</td>
    <td>`+__data["as-consumer"]["0"]["certificate-serial-number"]+`</td>
  </tr>
  <tr>
    <td>certificate-fingerprint:</td>
    <td>`+__data["as-consumer"]["0"]["certificate-fingerprint"]+`</td>
  </tr>
  <tr>
  <td>resource-id</td>
  <td>`+__data["as-consumer"]["0"].request["0"]["id"]+`</td>
</tr>
    </tbody>
  </table>
</div>


    <div class="card"">
  <div class="card-header card-header font-weight-bold text-uppercase">
    As producer
  </div>
  <table class="card-table table">
  <tbody>
  <tr>
    <td>consumer:</td>
    <td>`+__data["as-provider"]["0"]["consumer"]+`</td>
  </tr>
  <tr>
  <td>token-hash:</td>
  <td>`+__data["as-provider"]["0"]["token-hash"]+`</td>
</tr>
<tr>
<td>token-issued-at:</td>
<td>`+__data["as-provider"]["0"]["token-issued-at"]+`</td>
</tr>
<tr>
<td>introspected:</td>
<td>`+__data["as-provider"]["0"]["introspected"]+`</td>
</tr>
<tr>
<td>revoked:</td>
<td>`+__data["as-provider"]["0"]["revoked"]+`</td>
</tr>
<tr>
<td>expiry:</td>
<td>`+__data["as-provider"]["0"]["expiry"]+`</td>
</tr>
<tr>
<td>certificate-serial-number:</td>
<td>`+__data["as-provider"]["0"]["certificate-serial-number"]+`</td>
</tr>
<tr>
<td>certificate-fingerprint:</td>
<td>`+__data["as-provider"]["0"]["certificate-fingerprint"]+`</td>
</tr>
<tr>
<td>resource-id:</td>
<td>`+__data["as-provider"]["0"].request["0"]["id"]+`</td>
</tr>
</tbody>
  </table>
</div>


    `
    
    
}

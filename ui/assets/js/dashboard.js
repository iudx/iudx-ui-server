/*----------------------------------------------
 For Pagination
-----------------------------------------------*/



var page_limit = 10;
var max_visible_pagesinpagination_bar = 10;
var __DATA;

/*----------------------------------------------
 For Auth set policy & manage groups
-----------------------------------------------*/
var row_count = 0;
var row_count_grp = 0;


$( document ).ready(function() {
    $(".section-manageGroups").hide(10);
    $(".section-setPolicyRules").hide(10);
    $(".section-audit").hide(10);
    $(".section-create").hide(10);
    $("#confirmation_modal").hide(10);
 });

 function displaySetPolicy(){
    $(".section-audit").hide(10);
    $(".section-manageGroups").hide(10);
    $("#searched_provider_items").hide(10);
    $(".section-create-form").hide(10);
     $(".section-setPolicyRules").show(10);
     $("#confirmation_modal").hide(10);
 }

 function displayManageGroups(){
    $(".section-audit").hide(10);
    $(".section-setPolicyRules").hide(10);
    $("#searched_provider_items").hide(10);
    $("#section-create-form").hide(10);
    $(".section-manageGroups").show(10);
    $("#confirmation_modal").hide(10);
}

function displayAuditSection(){
    $(".section-manageGroups").hide(10);
    $(".section-setPolicyRules").hide(10);
    $("#searched_provider_items").hide(10);
    $("#section-create-form").hide(10);
    $(".section-audit").show(10);
    $("#confirmation_modal").hide(10);
}

function displayProviderItems(){
    $(".section-manageGroups").hide(10);
    $(".section-setPolicyRules").hide(10);
    $(".section-audit").hide(10);
    $(".section-create").hide(10);
    $("#searched_provider_items").show(10);
    $("#confirmation_modal").hide(10);
}

function displayCreateSection(){
    $(".section-manageGroups").hide(10);
    $(".section-setPolicyRules").hide(10);
    $(".section-audit").hide(10);
    $("#searched_provider_items").hide(10);
    $(".section-create").show(10);
    $("#confirmation_modal").hide(10);
}
// SET POLICY RULES

const $tableID = $('#table');
const $BTN = $('#export-btn');
const $EXPORT = $('#export');

//For removing rows from the table on clicking Remove button
$tableID.on('click', '.table-remove', function () {

	$(this).parents('tr').detach();
	row_count = row_count - 1;
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
		//console.log(data);
	});

	var str1 = "";

	// Output the result
	// $EXPORT.text(JSON.stringify(data));
	var a = [];
	var b = [];

	for (var i = 0; i <= data.length - 1; i++) {

		// console.log(data[i]);
		tokenVal = get_token_validiy(i)
		// console.log("Gpot",tokenVal,typeof (tokenVal));
		// console.log(tokenVal === "undefined")//false

		r = data[i]["email-id"].trim() + " can access " + data[i]["resource-id"].trim();
		console.log(tokenVal)
		tokenPeriod = $('#dropdownValue_' + i).text()
		if (tokenVal) {
			console.log("i m here")
			r += " for " + tokenVal.trim() + " " + tokenPeriod.trim();
			console.log(r)
		}

		if (data[i]["condition"]) {
			r += " if " + data[i]["condition"].trim();
			console.log(r)
		}
		console.log(r)
		b.push(r);
	}
	console.log(b)
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
	console.log($(this).parents('tr')[0].innerText);
	var str = $(this).parents('tr')[0].innerText;
	//str.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
	var stringArray = str.split(/(\s+)/);

	console.log(stringArray)
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

			console.log(header, $td.eq(i).text())

			h[header] = $td.eq(i).text();
		});

		data_grp.push(h);
		console.log(data_grp);
	});

	var str1 = "";


	for (var i = 0; i <= data_grp.length - 1; i++) {

		console.log(data_grp[i]);
		validity = get_validity(i)
		// $('#txtBoxGrp_' + i).val()
		// console.log("Gpot",tokenVal,typeof (tokenVal));
		// console.log(tokenVal === "undefined")//false

		email = data_grp[i]["email-id"].trim();
		grp = data_grp[i]["group"].trim();

		console.log(email, grp, validity)

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

		console.log(data[i]);
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


//For set Policy Rules:::::::

function setPolicy(rule) {

    console.log(rule);
    var json_rule = { "policy": rule };
    $.ajax({

        url: 'https://auth.iudx.org.in/auth/v1/acl/set',

        type: 'POST',

        //      dataType: "json",
        contentType: 'application/json',
        data: JSON.stringify(json_rule),
        success: function (data, textStatus, jQxhr) {
            alert("Success! \nPolicies Set ")
            console.log(data, textStatus, jQxhr);
        },
        error: function (jqXhr, StatusText, errorThrown) {
            console.log(errorThrown, jqXhr, StatusText);

        }
    });
    // if(status==='OK'){
    // 	alert("Success! \nPolicies Set ")
    // }
}


function addPolicy() {


    // getPolicy();
    console.log("Adding ", row_count);

    $("#tbody").append(`
            <tr>
                  
                  <td class="pt-3-half border-right" ><div contenteditable="true" data-text="&lt;consumer-email(s)&gt;"></div></td>
                  <td class="pt-3-half no-border">Can access</td>
                  <td class="pt-3-half border-right"><div contenteditable="true" data-text="&lt;resource-Id(s)&gt;"></div></td>
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
                  <td class="pt-3-half border-right"><div contenteditable="true" data-text="condition"></div></td>
                  <td><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0">Remove</button></span>
                  </td>
            </tr>
        `);

    get_token_validiy(row_count);
    row_count = row_count + 1;
}
function getPolicy() {

    // console.log("Adding get Policy", row_count);
    // $.get("https://jsonplaceholder.typicode.com/posts", function(data) {
    $.get("https://auth.iudx.org.in/auth/v1/acl", function (data) {
        //console.table(data);
        policy = [];
        // console.log(data)
        policies_arr = data.policy.split(";");
        //  console.log(policies_arr)
        $("#tbody").html("")
        for (i = 0; i < policies_arr.length; i++) {
            console.log(policies_arr[i])

            $("#tbody").append(parse_p(policies_arr[i]));
            get_token_validiy(i);

        }

    });

}
function parse_p(_data) {
    console.log(_data)
    var arr_res = [];
    _resVal = _data.split("can access");
    console.log(_resVal[0]);
    var rc = row_count
    row_count = row_count + 1
    // const str2= "";
    if (_resVal[1].includes("if") && !(_resVal[1].includes("for"))) {
        // console.log("Here")
        _resVal1 = _resVal[1].split("if")
        arr_res.push(_resVal[0]);
        arr_res.push(_resVal1[0]);
        console.log(arr_res[1])
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
    console.log(_res[1], _rc)
    //BOTH 'for' and 'if are present
    _arr_res = [];

    if (_res[1].includes("for") && _res[1].includes("if")) {
        _res2 = _res[1].split("for");
        _res3 = _res2[1].split("if");
        _res4 = _res3[0].split(" ");
        _arr_res.push(_res3[1]);
        console.log(_res4)
        console.log(_res3)
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
        console.log(_res2)
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

function addGroups() {


    // getGroups();
    console.log("Adding ", row_count_grp);

    $("#tbody_grp").append(`
		<tr>
			  
			  <td class="pt-3-half border-right" ><div contenteditable="true" data-text="&lt;consumer-email(s)&gt;"></div></td>
			  <td class="pt-3-half border-right"><div contenteditable="true" data-text="&lt;group&gt;"></div></td>
			 
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

//FOr Managing & Setting Groups

function setGroups(grp, email, validity) {

    console.log(grp, email, validity);
    var json_rule = { "group": grp, "consumer": email, "valid-till": validity };
    $.ajax({

        url: 'https://auth.iudx.org.in/auth/v1/group/add',

        type: 'POST',

        //      dataType: "json",
        contentType: 'application/json',
        data: JSON.stringify(json_rule),
        success: function (data, textStatus, jQxhr) {
            alert("Success! \nGroups Added successfully ")
            console.log(data, textStatus, jQxhr);
        },
        error: function (jqXhr, StatusText, errorThrown) {
            console.log(errorThrown, jqXhr, StatusText);
            alert("Error!\n" + StatusText)

        }
    });

}

function getGroups() {

    //json_rule = {"vgroup":"grp"}

    $.ajax({

        url: 'https://auth.iudx.org.in/auth/v1/group/list',

        type: 'POST',

        contentType: 'application/json',
        //data: JSON.stringify(json_rule),
        success: function (data, textStatus, jQxhr) {
            // alert("Success! \nPolicies Set ")
            console.log(data, textStatus, jQxhr);

            for (i = 0; i < data.length; i++) {
                console.log(data[i]["valid-till"])
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
            console.log(errorThrown, jqXhr, StatusText);

        }
    });



}

function deleteGroups(grp, email) {

    json_rule = { "group": grp, "consumer": email }
    $.ajax({
        url: 'https://auth.iudx.org.in/auth/v1/group/delete',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(json_rule),
        success: function (data, textStatus, jQxhr) {
            alert("Success! \nGroup(s) Deleted successfully ")
            console.log(data, textStatus, jQxhr);
            $(this).parents('tr').detach();
        },
        error: function (jqXhr, StatusText, errorThrown) {
            console.log(errorThrown, jqXhr, StatusText);
            alert("Error!\n" + errorThrown)

        }

    });
    row_count = row_count - 1;
}

function get_validity(row_num_grp) {
    console.log("Counting" + row_num_grp)
    console.log($('#txtBoxGrp_' + row_num_grp).val())
    return $('#txtBoxGrp_' + row_num_grp).val()

}

function get_token_validiy(row_num) {



    $(document).on("click", "#myDropdown_" + row_num + " li", function () {
        // alert($(this).text());
        //row_num = row_num + 1; 
        console.log("Counting" + row_num)

        var selectedValue = $(this).text();
        console.log(selectedValue)
        $('#dropdownValue_' + row_num).text(selectedValue)


    })

    // console.log($('#dropdownValue_' + row_num +':selected').text())
    // return $("#txtBox_" + row_num).val() + " " + $('#dropdownValue_' + row_num).text();
    return $("#txtBox_" + row_num).val()
}

// Functions for Access Token & Get Data from Token in Consumer


function request_access_token() {
    console.log("Rohina")

    // var body = {"resource-id":"rbccps.org/aa9d66a000d94a78895de8d4c0b3a67f3450e531/safetipin/safetipin/safetyIndex"};
    var body = { "request": { "resource-id": $("#r-id").val() } };

    if ($("#api").val().trim() !== "")
        body.api = $("#api").val().trim();

    if ($("#methods").val().trim() !== "")
        body.methods = $("#methods").val().trim().split(",");

    console.log("Sending", body);
    if ($("#expiration").val().trim() !== "")
        body.expiration = $("#expiration").val().trim();

    console.log("Sending", body);


    $.ajax({
        url: "https://auth.iudx.org.in/auth/v1/token",
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(body),
        success: function (data) {
            console.log(data)
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
                console.log(localStorage.getItem(localStorage.key(i)));
            }

            console.log('retrievedObject: ', JSON.parse(retrievedObject));
            //   localStorage.TokenList = (JSON.stringify(data));
            $('#token_value').val(data.access_token);
            console.log($('#token_value').val())

        },
        error: function (jqXHR, exception) {
            alert("Unauthorized access! Please get a token.")
        }
    });
}


// function get_data_from_token() {


//     _token = $("#token_value").val();
//     console.log(_token)

//     $.ajax({else {
//         if(('#no_btn').val()===no)
//         $("#co
//         url: "https://pune.iudx.org.in/api/1.0.0/resource/search/safetypin/18.56581555/73.77567708/10",
//         type: 'GET',
//         headers: { "token": "_token" },
//         success: function (data) {
//             console.log(JSON.parse(data));

//             alert("Success! \nGet Data: " + data)

//             btn      },
//         error: function (jqXHR, exception) {
//             alert("ERR", exception)
//         }
//     });
// }

/*-------------------------------------
    section-homepage-catalogue
---------------------------------------*/

function json_to_htmlcard(json_obj){
    //  console.log(json_obj);
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
			<div id="card_`+ resource_id_to_html_id(json_obj['id']) +`" style="display:inline-block;" class="col-12 card-margin-top">
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
			    <div class="btn-3-set" id="btn_`+resource_id_to_html_id(json_obj.id)+`">
			    <button class="btn btn-primary color-blue btn-3-set" onclick="show_details('`+ json_obj.id +`')">Details</button>
			    <!--button class="btn btn-success" onclick="display_swagger_ui('` + openapi_url + `')">API Details</button-->
			    `+ ((is_public)?"":rat_btn_html) +`
			    <a href="#" style="color:white"  class="data-modal" onclick="edit_data_from_list('`+json_obj['id']+`')"><button class="btn color-green btn-3-set">Edit</button></a>
			    <a style="color:white"  class="data-modal" onclick="show_confirmation_modal('`+json_obj['id']+`')"><button class="btn color-green btn-3-set">Delete</button></a>
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


function get_horizontal_spaces(space_count){
	var horizontal_space_str=""
	for (var i = space_count.length - 1; i >= 0; i--) {
		horizontal_space_str+="&nbsp;"
	}
	return horizontal_space_str;
}

function resource_id_to_html_id(resource_id) {
    var replace_with = "_";
    return resource_id.replace(/\/|\.|\s|\(|\)|\<|\>|\{|\}|\,|\"|\'|\`|\*|\;|\+|\!|\#|\%|\^|\&|\=|\₹|\$|\@/g, replace_with)
}

function display_paginated_search_results(page_num){
	var global_data = get_global_data();
	$("#searched_provider_items").html("");
	var from = min(((page_num-1)*get_page_limit()),global_data.length);
	var to = min(((page_num)*get_page_limit()-1), global_data.length);
	for (var i=from;i < to; i++) {
		$("#searched_provider_items").append(json_to_htmlcard(global_data[i]));	
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


function get_global_data(){
	return __DATA;
}

function set_data_globally(_data){
	__DATA = _data;
}

function set_page_limit(_page_limit){
	page_limit = _page_limit;
}

function get_page_limit(){
	return page_limit;
}

function min(val1, val2){
	return Math.min(val1, val2);
}

function toast_alert(__msg, __msg_type, __bg_color) {
    $.toast({
        heading: 'Success',
        text: `<b style="font-size: 20px !important;height: auto;
        text-align: center;
        width: 25%;
        ">` + __msg + `</b>`,
        position: 'bottom-right',
        hideAfter: 2000,
        loader: false,  // Whether to show loader or not. True by default
        loaderBg: '#32c27d',
        bgColor: __bg_color,
        showHideTransition: 'fade', // fade, slide or plain
        allowToastClose: false, // Boolean value true or false
        icon: __msg_type// Type of toast icon  
    })
}

function create_confirmation_modal(_id){
    return `
    <section id="modal_`+ resource_id_to_html_id(_id) +`" class="confirmation_box">
    <div class="modal in" style="display: block;">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title">Are you sure???</h4>
                </div>
                <div class="modal-body">
                  <p>Are you sure you want to delete (this)?</p>
                  <div class="row">
                      <div class="col-12-xs">
                          <button style="margin-left: 15px;margin-right: 10px;"id="confirm_btn" class="btn btn-success btn-md"  onclick="call_delete_api('` + _id + `')" value="yes" >Yes</button>
                          <button id="no_btn" class="btn btn-danger btn-md" value="no" onclick="remove_modal('`+ get_modal_id(_id) +`')">No</button>
                      </div>
                  </div>
                </div>
             
              </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
          </div><!-- /.modal -->
        </section>
    `
}

/*--------------------------------------------
Edit & delete functions in catalogue homepage
----------------------------------------------*/

function remove_modal(modal_id){
    $(modal_id).remove()
}

function get_modal_id(_id){
    return "#modal_"+ resource_id_to_html_id(_id)
}

function call_delete_api(_id){
    var modal_id = get_modal_id(_id)
    // console.log(1)
    $.ajax({
        url: cat_conf['cat_base_URL'] + "/items/" +_id ,
        headers: {"Authorization" : "Basic cm9oaW5hOnJvaGluYXJiY2Nwcw=="},
        type: 'DELETE',
          complete: function(e, xhr, settings){
            remove_modal(modal_id)
            if(e.status === 204){
                $("#card_"+ resource_id_to_html_id(_id)).remove();
                $('#searched_provider_items').html($('searched_provider_items').html()) 
                toast_alert( 'Item deleted successfully', 'success', '#248c5a')
            }else if(e.status === 400){
                toast_alert(xhr, 'warning', '#1abc9c')
            }
        }
    });
    // console.log(2)
}

function show_confirmation_modal(_id) {
    // // $("#confirmation_modal").html("");
    var modal_id = get_modal_id(_id)
    $("body").append(create_confirmation_modal(_id))
    $(modal_id).show();
    
    $("#no_btn").click(function(){
        remove_modal(modal_id);
    });
}

// delete_data_from_list('`+json_obj['id']+`')

// function showConfirmationBox(_id) {
//     $("#confirmation_modal").html("");
//     $("#confirmation_modal").append(confirmation_box_to_html())
//     $("#confirmation_modal").show();
//     console.log($("#confirm_btn").val());
    
// }

function duplicar_xblock(block_id, display_name){
    var boton = $('#duplicar-block-button')[0];
    boton.className = "button action-primary action-move is-disabled";
    $('#duplicar-info')[0].innerHTML = "Elija donde desea duplicar"
    $('#o_block_id').val(block_id)
    $('#d_block_id').val('');
    var div_modal = document.getElementById('duplicate-div')
    var header_modal = div_modal.getElementsByClassName('modal-window-title')[0]
    header_modal.innerText = "Duplicar " + display_name
    $('#duplicate-div').show()
    $('#duplicate-container').hide()
    $('#ui-loading-duplicate-save').hide()
    $('#ui-loading-duplicate-load').show()
    var domain = window.location.origin.replace('studio.','')
    $.ajax({
        url: domain + "/api/enrollment/v1/enrollment",
        dataType: 'json',
        type: "GET",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(response_enroll){
            $.ajax({
                url: domain + "/api/enrollment/v1/roles/",
                dataType: 'json',
                type: "GET",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function(response_rol){
                    var html_course = '<ol class="block-tree accordion" aria-labelledby="expand-collapse-outline-all-button">'
                    courses = create_dict_courses(response_enroll, response_rol)
                    for (var i = 0; i < courses.length; i++) {
                        html_course = html_course + create_accordion_course(courses[i][0], courses[i][1])
                    }
                    html_course = html_course + '</ol>'
                    if (courses.length > 0)
                        $('#duplicate-container').html(html_course)
                    else
                        $('#duplicar-info')[0].innerHTML = "No está inscrito en ningún curso aún y/o no posee rol de 'Equipo'."
                    $('#ui-loading-duplicate-load').hide()
                    $('#duplicate-container').show()
                },
                error: function() {
                    alert("Error inesperado ha ocurrido. Actualice la página e intente nuevamente")
                }
            });
        },
        error: function() {
            alert("Error inesperado ha ocurrido. Actualice la página e intente nuevamente")
        }
    });
}
function duplicar_get_data(e){
    o_block_id = $('#o_block_id').val()
    o_block_type = o_block_id.split('@')[1]
    o_block_type = o_block_type.split('+')[0]
    parent_block = e.parentElement
    course_id = parent_block.getAttribute('aria-controls')
    if(e.getAttribute('aria-controls') != ""){
        duplicar_accordion_trigger(e)
    }
    else{
    if(o_block_type == "chapter"){
        set_d_block_id(course_id)
    }
    else{
        disabled_enabled_button(true)
        var next_block_loading = course_id+'_ui'
        var block_ui_loading = document.getElementById(next_block_loading)
        if (block_ui_loading) block_ui_loading.style.display = "block";
        $.ajax({
            url: "/course/"+course_id+"?format=concise",
            dataType: 'json',
            cache: false,
            contentType: "application/json",
            processData: false,
            type: "GET",
            success: function(response){
                e.setAttribute('aria-controls', response['id'] + '_duplicate')
                var html_course = ""
                //section
                if (o_block_type != 'chapter' && 'child_info' in response){
                html_course = '<ol class="block-tree accordion" id="'+response['id']+'_duplicate" aria-labelledby="expand-collapse-outline-all-button">'
                for (var i = 0; i < response['child_info']['children'].length; i++) {
                    var section = response['child_info']['children'][i]
                    html_course = html_course + create_accordion_section(section, o_block_type)
                    //subsection
                    if (o_block_type != 'sequential' && 'child_info' in section){
                    html_course = html_course + '<ol class="outline-item accordion-panel is-hidden" id="'+section['id']+'_duplicate">'
                    for (var j = 0; j < section['child_info']['children'].length; j++) {
                        var subsection = section['child_info']['children'][j]
                        html_course = html_course + create_accordion_subsection(subsection, o_block_type)
                        //unit
                        if (o_block_type != 'vertical' && 'child_info' in subsection){
                        html_course = html_course + '<ol class="outline-item accordion-panel is-hidden" id="'+subsection['id']+'_duplicate">'
                        for (var k = 0; k < subsection['child_info']['children'].length; k++) {
                            var unit = subsection['child_info']['children'][k]
                            html_course = html_course + create_accordion_unit(unit)                              
                        }
                        html_course = html_course + '</li></ol>'
                        }
                        else{
                        html_course = html_course + '</li>'
                        }
                    }
                    html_course = html_course + '</li></ol>'
                    }
                    else{
                    html_course = html_course + '</li>'
                    }
                }
                html_course = html_course + '</ol>'
                }
                parent_block.innerHTML = parent_block.innerHTML + html_course
                var next_block = response['id'] + '_duplicate'
                var block = document.getElementById(next_block)
                if (block) block.style.display = "block";
                var block_ui_loading = document.getElementById(next_block_loading)
                if (block_ui_loading) block_ui_loading.style.display = "none";
                disabled_enabled_button(false)
            },
            error: function() {
                alert("Error inesperado ha ocurrido. Actualice la página e intente nuevamente")
            }
        });
    }
    }
}
function create_dict_courses(courses, roles){
    course_rol = {}
    if (roles['is_staff'] == true){
        for(var j=0;j<courses.length;j++){
            course_rol[courses[j]['course_details']['course_id']] = courses[j]['course_details']['course_name']
        }
    }
    else{
        for(var i=0;i<roles['roles'].length;i++){
            if (roles["roles"][i]["role"] == "instructor"){
                for(var j=0;j<courses.length;j++){
                    if (courses[j]['course_details']['course_id'] == roles["roles"][i]["course_id"]){
                        course_rol[roles["roles"][i]["course_id"]] = courses[j]['course_details']['course_name']
                    }
                }
            }
        }
    }
    
    return sortProperties(course_rol, false)
}
/**
 * Sort object properties (only own properties will be sorted).
 * @param {object} obj object to sort properties
 * @param {bool} isNumericSort true - sort object properties as numeric value, false - sort as string value.
 * @returns {Array} array of items in [[key,value],[key,value],...] format.
 */
function sortProperties(obj, isNumericSort)
{
	isNumericSort=isNumericSort || false; // by default text sort
	var sortable=[];
	for(var key in obj)
		if(obj.hasOwnProperty(key))
			sortable.push([key, obj[key]]);
	if(isNumericSort)
		sortable.sort(function(a, b)
		{
			return a[1]-b[1];
		});
	else
		sortable.sort(function(a, b)
		{
			var x=a[1].toLowerCase(),
				y=b[1].toLowerCase();
			return x<y ? -1 : x>y ? 1 : 0;
		});
	return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}
function disabled_enabled_button(action){
    var buttons = $('.dup-course-button')
    for(var i =0; i<buttons.length;i++){
        buttons[i].disabled = action
    }
}

function create_accordion_unit(data){
    var aux_html ='<li class="vertical outline-item focusable " data-access-denied="[]">'+
                    '<button onclick="duplicar_accordion_trigger(this);" class="subsection-text accordion-trigger outline-button" aria-controls="'+data['id']+'_duplicate">'+
                        '<div class="vertical-details">'+
                        '<span class="xblock-displayname truncate">'+
                            data['display_name']+
                        '</span>'+
                        '</div>'+
                    '</button>'+
                    '</li>';

    return aux_html
}

function create_accordion_subsection(data, o_block_type){ 
    var flecha = '<span class="fa fa-chevron-right " aria-hidden="true"></span>'
    if(o_block_type == 'vertical'){
        flecha = ''
    }
    var aux_html = '<li class="subsection accordion">'+
                    '<button onclick="duplicar_accordion_trigger(this);" class="subsection-text accordion-trigger outline-button" aria-expanded="false" aria-controls="'+data['id']+'_duplicate">'+
                    flecha+
                    '<span class="xblock-displayname truncate">'+
                        data['display_name']+
                    '</span></button>';

    return aux_html
}

function create_accordion_section(data, o_block_type){
    var flecha = '<span class="fa fa-chevron-right " aria-hidden="true"></span>'
    if(o_block_type == 'sequential'){
        flecha = ''
    }
    var aux_html = '<li class="outline-item section ">'+
                '<button onclick="duplicar_accordion_trigger(this);" class="section-name accordion-trigger outline-button" aria-expanded="false" aria-controls="'+data['id']+'_duplicate">'+
                    flecha+
                    ' <span class="xblock-displayname truncate">'+
                        data['display_name']+
                    '</span></button>';

    return aux_html
}

function create_accordion_course(course_id, name){
    var load_ui = '<div id="'+course_id+'_ui" class="ui-loading is-hidden"><p> <span class="spin"><span class="icon fa fa-refresh" aria-hidden="true"></span></span><span class="copy">Cargando</span></p></div>'
    var codigo = course_id.split("+")[0]+ "+"
    var aux_html = ' <li aria-controls="'+course_id+'" class="outline-item section dup-course">'+
                        '<button onclick="duplicar_get_data(this);" class="section-name accordion-trigger outline-button dup-course-button" aria-expanded="false" aria-controls="">'+
                        '<span class="xblock-displayname truncate">'+
                        name + " - ("+course_id.replace(codigo,"")+")"+
                        '</span></button>'+load_ui+'</li>';

    return aux_html
}
    
function duplicar_accordion_trigger(e){
    var flecha = e.getElementsByClassName('fa-chevron-right')[0]
    var next_block = e.getAttribute('aria-controls')
    var block = document.getElementById(next_block)
    if (block){
        if (block.style.display === "block") {
        if (flecha) flecha.className = 'fa fa-chevron-right'
        block.style.display = "none";
        } else {
        if (flecha) flecha.className = 'fa fa-chevron-right fa-rotate-90'
        block.style.display = "block";
        }
    }
    set_d_block_id(next_block)
}

function set_d_block_id(next_block){
    var boton = $('#duplicar-block-button')[0];
    block_type_dict = {
            'course':1,
            'chapter':2,
            'sequential':3,
            'vertical':4};
    o_block_id = $('#o_block_id').val()
    o_block_type = o_block_id.split('@')[1]
    o_block_type = o_block_type.split('+')[0]
    if (o_block_type == 'chapter'){
        $('#d_block_id').val(next_block);
        boton.className = "button action-primary action-move";
    }
    else{
        d_block_type = next_block.split('@')[1]
        d_block_type = d_block_type.split('+')[0]
        if(block_type_dict[o_block_type]!== undefined && ((block_type_dict[o_block_type] - 1) == block_type_dict[d_block_type])){
            $('#d_block_id').val(next_block.substring(0,next_block.length - 10))
            boton.className = "button action-primary action-move";
        }
        else{
            if (block_type_dict[o_block_type] === undefined && 4 == block_type_dict[d_block_type]){
                //xblock
                $('#d_block_id').val(next_block.substring(0,next_block.length - 10))
                boton.className = "button action-primary action-move";
            }
            else{
                $('#d_block_id').val('')
                boton.className = "button action-primary action-move is-disabled";
            }
        }
    }
}
    
function duplicate_button(e){
    var d_block_id = $('#d_block_id').val();
    var o_block_id = $('#o_block_id').val();
    if (o_block_id && d_block_id){
        if (d_block_id.includes('course-v1:')){
            d_block_id = "block-v1:"+d_block_id.replace("course-v1:","")+"+type@course+block@course"
        }
        $('#ui-loading-duplicate-save').show()
        $('#duplicate-container').hide()
        var sendData = {
            dest_usage_key: d_block_id,
            origin_usage_key: o_block_id,
            action: 'json'
        };
        var boton = $('#duplicar-block-button')[0];
        $.ajax({
            url: "/eolduplicate/duplicate/",
            dataType: 'json',
            type: 'POST',
            data: sendData,
            success: function(response){
                if ('saved' in response && response['saved'] == 'saved'){
                    var url = '<a href="'+create_url(d_block_id)+'">presione aquí</a>'
                    $('#duplicar-info')[0].innerHTML = "Duplicado Correctamente. Actualice la página para visualizar los cambios o "+url+"</br></br>block-id= "+ response['location']
                }
                else{
                    $('#duplicar-info')[0].innerHTML = "Error inesperado ha ocurrido. Actualice la página e intente nuevamente"
                }
                boton.className = "button action-primary action-move is-disabled";
                $('#ui-loading-duplicate-save').hide()
            },
            error: function() {
                $('#ui-loading-duplicate-save').hide()
                $('#duplicar-info')[0].innerHTML = "Error inesperado ha ocurrido. Actualice la página e intente nuevamente"
                boton.className = "button action-primary action-move is-disabled";
            }
        });
    }
}
function create_url(d_block_id){
    var domain = window.location.origin
    d_block_type = d_block_id.split('@')[1]
    d_block_type = d_block_type.split('+')[0]
    if(d_block_type == "vertical"){
        return (domain+"/container/"+d_block_id)
    }
    return (domain+"/course/course-v1:"+d_block_id.split('+type@')[0].replace("block-v1:",""))
}
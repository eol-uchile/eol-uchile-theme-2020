/*
*   Init Simplified Settings
*   Called from:
*       js/factories/settings_advanced.js (After editor render)
*       js/views/settings/advanced.js (After any changes)
*/
const init_simplified_settings = (update=false) => {
    // By default hide advanced configurations
    if(!update) {
        // $().hide() doesn't work (rendering bugs)
        $('.deprecated-options, .course-advanced-policy-list').css({
        "visibility": "hidden",
        "height": "0px",
        "overflow": "hidden"
        });
        $("input[id='eol-advanced-settings']").change( ({ target }) => {
        if(target.checked) {
            $('.deprecated-options, .course-advanced-policy-list').css({
                "visibility": "visible",
                "height": "auto"
            });
        } else {
            $('.deprecated-options, .course-advanced-policy-list').css({
                "visibility": "hidden",
                "height": "0px"
            });
        }
        });
    }

    // Clear all checkbox inputs
    $(".course-simple-settings input").prop('checked', false);

    // Fill inputs
    fill_simplified_modules();
    fill_simplified_exam_configs();
    fill_simplified_subsection_gating();

    // Show simplified settings after load
    $('.course-simple-settings').show();
};

/*
*   This function will fill the checkboxes with the modules at the moment.
*   If the simplified modules has changes, it will modify the advanced modules configuration
*/
const fill_simplified_modules = () => {
    // Setting an ID for CodeMirror differentiation purposes
    $('#advanced_modules').parent().attr('id', 'advanced_modules_li');
    // Get the advanced modules CodeMirror instance
    var mirror = document.querySelector('#advanced_modules_li .CodeMirror').CodeMirror;
    // Get values inside textarea
    var advanced_modules = JSON.parse(mirror.getValue());

    // Set checked modules if exists
    for (let module of advanced_modules) {
        $("#advanced-xblocks #module_"+module).prop('checked', true);
    }

    /* Handle changes on Simplified Modules Checkbox */
    $("#advanced-xblocks input[id^='module_']").change( ({ target }) => {
        if(target.checked) {
            // Add to textarea
            advanced_modules.push(target.defaultValue);
        } else {
            // Delete from textarea
            advanced_modules = advanced_modules.filter(v => v !== target.defaultValue);
        }
        // Modify advanced modules configuration
        let new_value = JSON.stringify( advanced_modules, null, "\t" );
        mirror.setValue(new_value);
        mirror._handlers.blur[0](mirror) // Simulate 'blur' event (updates local model)
    });
};

/*
*   This function will fill the checkbox with the exam configuration.
*   If the simplifed exam configuration has changes, it will modify enable_timed_exams and enable_proctored_exams configuration
*/
const fill_simplified_exam_configs = () => {
    // Setting an ID for CodeMirror differentiation purposes
    $('#enable_timed_exams').parent().attr('id', 'enable_timed_exams_li');
    $('#enable_proctored_exams').parent().attr('id', 'enable_proctored_exams_li');
    // Get the CodeMirror instances
    var mirror_timed = document.querySelector('#enable_timed_exams_li .CodeMirror').CodeMirror;
    var mirror_proctored = document.querySelector('#enable_proctored_exams_li .CodeMirror').CodeMirror;
    // Get values inside textarea
    var enable_timed_exams = JSON.parse(mirror_timed.getValue().toLowerCase()); // Boolean
    var enable_proctored_exams = JSON.parse(mirror_proctored.getValue().toLowerCase()); // Boolean

    // Set checked if both are enabled
    $("#simplified-configs #simplified_exam_configs").prop('checked', enable_timed_exams && enable_proctored_exams);

    /* Handle changes on Enable Timed Exams Checkbox */
    $("#simplified-configs input[id='simplified_exam_configs']").change( ({ target }) => {
        // Modify timed exam and proctored exams configuration
        let new_value = JSON.stringify( target.checked, null, "\t" );
        mirror_timed.setValue(new_value);
        mirror_proctored.setValue(new_value);
        mirror_timed._handlers.blur[0](mirror_timed) // Simulate 'blur' event (updates local model)
        mirror_proctored._handlers.blur[0](mirror_proctored) // Simulate 'blur' event (updates local model)
    });
};

/*
*   This function will fill the checkbox with the subsection_gating configuration.
*   If the simplifed subsection_gating configuration has changes, it will modify advanced subsection_gating configuration
*/
const fill_simplified_subsection_gating = () => {
    // Setting an ID for CodeMirror differentiation purposes
    $('#enable_subsection_gating').parent().attr('id', 'enable_subsection_gating_li');
    // Get the CodeMirror instance
    var mirror = document.querySelector('#enable_subsection_gating_li .CodeMirror').CodeMirror;
    // Get values inside textarea
    var enable_subsection_gating = JSON.parse(mirror.getValue().toLowerCase()); // Boolean

    // Set checked if enabled
    $("#simplified-configs #simplified_subsection_gating").prop('checked', enable_subsection_gating);

    /* Handle changes on Enable Timed Exams Checkbox */
    $("#simplified-configs input[id='simplified_subsection_gating']").change( ({ target }) => {
        // Modify timed exam and proctored exams configuration
        let new_value = JSON.stringify( target.checked, null, "\t" );
        mirror.setValue(new_value);
        mirror._handlers.blur[0](mirror) // Simulate 'blur' event (updates local model)
    });
};

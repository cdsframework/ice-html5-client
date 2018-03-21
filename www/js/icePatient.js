/**
 * Patient related script.
 * 
 */

// Used for multi-stage patient operations
var selectedPatient;

/**
 * Get the selected patient.
 * 
 * @returns {id|selectedPatient}
 */
function getSelectedPatient() {
    return selectedPatient;
}

/**
 * Sets the selected patient.
 * 
 * @param {type} id
 * @returns {undefined}
 */
function setSelectedPatient(id) {
    selectedPatient = id;
}

/**
 * Retrieve the patient list from the local storage mechanism
 * 
 * @returns {Array|Object}
 */
function getPatientList() {
    var rawPatientList = localStorage.getItem('patientList');
    if (rawPatientList === '{}' || rawPatientList === null || rawPatientList === '') {
        localStorage.setItem('patientList', defaultPatientList);
        rawPatientList = localStorage.getItem('patientList');
    }
//    console.log(JSON.parse(rawPatientList));
    return JSON.parse(rawPatientList);
}

/**
 * Sets the patient list in the local storage mechanism
 * 
 * @param {type} patientList
 * @returns {undefined}
 */
function setPatientList(patientList) {
    localStorage.setItem('patientList', JSON.stringify(patientList));
}

/**
 * Saves a patient from the form on the savePatient page.
 * 
 * @returns {undefined}
 */
function savePatient() {
//    if (typeof (console) !== 'undefined' && typeof (console.log) !== 'undefined') {
//        console.log($('#savePatientForm').valid());
//    }
    if ($('#savePatientForm').valid() === false) {
        return false;
    }

    var patientId = $('#patientId')[0].value;

    if (patientId === null || patientId === '' || typeof (patientId) === 'undefined') {
        patientId = getGuid();
    }

    var firstName = $('#firstName')[0].value;
    var lastName = $('#lastName')[0].value;

    var gender = $('input[name="gender"]:checked').val();

    var dob = $('#dob')[0].value;

    var evalDate = $('#evalDate')[0].value;

    var izEntryTable = $('#izEntryTable')[0];
    var tbdy = izEntryTable.getElementsByTagName('tbody')[0];
    var trs = tbdy.getElementsByTagName('tr');
    var izs = [];

    for (var i = 0; i < trs.length; i++) {
        var tr = trs[i];
        var inputs = tr.getElementsByTagName('input');
        var selects = tr.getElementsByTagName('select');

        izs[izs.length] = [
            inputs[2].name.substring(2, inputs[0].name.length),
            inputs[2].value,
            selects[0].value,
            inputs[0].checked ? 'I' : 'D'];
    }

    var patient = {
        'firstName': firstName,
        'lastName': lastName,
        'gender': gender,
        'dob': dob,
        'evalDate': evalDate,
        'id': patientId,
        'izs': izs
    };
    var patientList = getPatientList();
    patientList[patientId] = patient;
    setPatientList(patientList);
    selectedPatient = null;
    currentPage = 'main';
    document.location.href = '#main';
    location.reload();
}

function editPatient(patientId) {
    var patient = getPatientList()[patientId];
    selectedPatient = patient;

    var tbdy = clearSavePatient();

    $('#patientId')[0].value = patientId;

    $('#firstName')[0].value = patient['firstName'];
    $('#lastName')[0].value = patient['lastName'];

    $('input[name="gender"][value="' + patient['gender'] + '"]').prop('checked', true);

    $('#dob')[0].value = patient['dob'];

    if (patient['evalDate'] !== null && typeof (patient['evalDate']) !== 'undefined' && patient['evalDate'] !== '') {
        $('#evalDate')[0].value = patient['evalDate'];
    }

    for (var i = 0; i < patient['izs'].length; i++) {
        appendIzTableRow(tbdy, patient['izs'][i]);
    }
    $('#izEntryTable').trigger('create');
//    $('#izEntryTable').table('refresh');
}

function clearSavePatient() {
    $('#savePatientForm')[0].reset();
    var izEntryTable = $('#izEntryTable')[0];
    var tbdy = izEntryTable.getElementsByTagName('tbody')[0];
    while (tbdy.firstChild) {
        tbdy.removeChild(tbdy.firstChild);
    }

    return tbdy;
}

function deletePatient(patientId) {
    var patientList = getPatientList();
    delete patientList[patientId];
    setPatientList(patientList);
    currentPage = 'main';
    document.location.href = '#main';
    location.reload();
}

function listPatients() {
    var tbl = $('#patientListTable')[0];
    var tbdy = tbl.getElementsByTagName('tbody')[0];
    while (tbdy.firstChild) {
        tbdy.removeChild(tbdy.firstChild);
    }
    var tr, td, span, patDiv0, patDiv1, patDiv2, patDiv3, patA, exportButton, editButton, deleteButton, iceButton;
    var patientList = getPatientList();
    for (var key in patientList) {
        var patient = patientList[key];
        tr = document.createElement('tr');
        td = document.createElement('td');
        span = document.createElement('span');
        span.setAttribute('class', 'inline-label');

        patDiv0 = document.createElement('div');
        patDiv1 = document.createElement('div');
        patDiv1.setAttribute('class', 'ui-shadow icePatSquare');

        span = document.createElement('span');
        span.setAttribute('class', 'inline-label');
        span.appendChild(document.createTextNode('Name: '));

        patDiv1.appendChild(span);
        patDiv1.appendChild(document.createTextNode(patient['lastName'] + ', ' + patient['firstName']));
        patDiv1.appendChild(document.createElement('br'));

        span = document.createElement('span');
        span.setAttribute('class', 'inline-label');
        span.appendChild(document.createTextNode('DOB: '));

        patDiv1.appendChild(span);
        patDiv1.appendChild(document.createTextNode(getFormattedDateFromISO(patient['dob'])));
        patDiv1.appendChild(document.createElement('br'));

        span = document.createElement('span');
        span.setAttribute('class', 'inline-label');
        span.appendChild(document.createTextNode(' Gender: '));

        patDiv1.appendChild(span);
        patDiv1.appendChild(document.createTextNode(patient['gender']));
        patDiv1.appendChild(document.createElement('br'));

        /**
         * IZ popup table
         */
        patA = document.createElement('a');
        patA.setAttribute('href', '#PAT' + key);
        patA.setAttribute('data-rel', 'popup');
        patA.setAttribute('data-transition', 'pop');
        patA.setAttribute('title', 'Immunizations');
        patA.setAttribute('class', 'my-tooltip-btn ui-btn ui-btn-inline ui-icon-bullets ui-corner-all ui-shadow ui-btn-icon-notext immunizationPopup');
        patDiv1.appendChild(patA);


        patDiv2 = document.createElement('div');
        patDiv2.setAttribute('class', 'ui-content izPopup');
        patDiv2.setAttribute('data-role', 'popup');
        patDiv2.setAttribute('id', 'PAT' + key);

        var izTbl = document.createElement('table');
        izTbl.setAttribute('data-role', 'table');
        izTbl.setAttribute('class', 'ui-responsive izTable');
        var izThead = document.createElement('thead');
        var izTr = document.createElement('tr');

        var izTh = document.createElement('th');
        izTh.appendChild(document.createTextNode('Date'));
        izTr.appendChild(izTh);

        izTh = document.createElement('th');
        izTh.appendChild(document.createTextNode('Code'));
        izTr.appendChild(izTh);

        izTh = document.createElement('th');
        izTh.appendChild(document.createTextNode('Type'));
        izTr.appendChild(izTh);

        izThead.appendChild(izTr);
        izTbl.appendChild(izThead);
        var izTbody = document.createElement('tbody');

        if (typeof (patient['izs']) !== 'undefined') {
            for (var i = 0; i < patient['izs'].length; i++) {
                var iz = patient['izs'][i];
                if (iz[1] !== null && iz[1] !== '') {
                    izTr = document.createElement('tr');

                    var izTd = document.createElement('td');
                    izTd.setAttribute('style', 'white-space: nowrap;');
                    izTd.appendChild(document.createTextNode(getFormattedDateFromISO(iz[1])));
                    izTr.appendChild(izTd);

                    izTd = document.createElement('td');
                    izTd.appendChild(document.createTextNode(iz[2]));
                    izTr.appendChild(izTd);

                    var eventType = 'I';
                    if (iz[3] !== null && typeof (iz[3]) !== 'undefined' && iz[3] !== '') {
                        eventType = iz[3];
                    }
                    izTd = document.createElement('td');
//                    izTd.setAttribute('style', 'text-align:center;');
                    izTd.appendChild(document.createTextNode(eventType));
                    izTr.appendChild(izTd);

                    izTbody.appendChild(izTr);
                }
            }
        }
        izTbl.appendChild(izTbody);

        patDiv2.appendChild(izTbl);
        var section = document.createElement('section');
        var h3 = document.createElement('h3');
        h3.appendChild(document.createTextNode('Type:'));
        section.appendChild(h3);
        var ul = document.createElement('ul');
        var li = document.createElement('li');
        li.appendChild(document.createTextNode('I: Immunization'));
        ul.appendChild(li);
        li = document.createElement('li');
        li.appendChild(document.createTextNode('D: Disease Documented/Proof of Immunity'));
        ul.appendChild(li);
        section.appendChild(ul);
        patDiv2.appendChild(section);
        patDiv0.appendChild(patDiv2);

        /**
         * Action buttons
         */
        patDiv3 = document.createElement('div');
        patDiv3.setAttribute('class', 'floatRight');

        if (!mobileDetected) {
            exportButton = document.createElement('a');
            exportButton.setAttribute('class', 'ui-btn ui-icon-arrow-d ui-btn-icon-notext ui-corner-all ui-shadow floatLeft');
            exportButton.setAttribute('title', 'Export Patient');
            exportButton.setAttribute('download', key + '.json');
            exportButton.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify([patient])));
            exportButton.appendChild(document.createTextNode(' '));
            patDiv3.appendChild(exportButton);
        }

        editButton = document.createElement('a');
        editButton.setAttribute('class', 'ui-btn ui-icon-edit ui-btn-icon-notext ui-corner-all ui-shadow floatLeft');
        editButton.setAttribute('title', 'Edit');
        editButton.setAttribute('href', '#savePatient');
        editButton.setAttribute('onclick', 'editPatient(\'' + key + '\');currentPage = \'savePatient\';$.mobile.changePage(\'#savePatient\');');
        editButton.appendChild(document.createTextNode(' '));
        patDiv3.appendChild(editButton);

        deleteButton = document.createElement('a');
        deleteButton.setAttribute('class', 'ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all ui-shadow floatLeft');
        deleteButton.setAttribute('title', 'Delete');
        deleteButton.setAttribute('href', '#deleteConfirm');
        deleteButton.setAttribute('data-transition', 'pop');
        deleteButton.setAttribute('data-rel', 'dialog');
        deleteButton.setAttribute('onclick', 'setSelectedPatient(\'' + key + '\');currentPage = \'deleteConfirm\';$.mobile.changePage(\'#deleteConfirm\');');
        deleteButton.appendChild(document.createTextNode(' '));
        patDiv3.appendChild(deleteButton);

        iceButton = document.createElement('a');
        iceButton.setAttribute('class', 'ui-btn ui-icon-action ui-btn-icon-notext ui-corner-all ui-shadow floatLeft');
        iceButton.setAttribute('title', 'ICE Patient');
        iceButton.setAttribute('href', '#icePatient');
        iceButton.setAttribute('data-transition', 'pop');
        iceButton.setAttribute('data-rel', 'dialog');
        iceButton.setAttribute('onclick', 'icePatient(\'' + key + '\');currentPage = \'icePatient\';$.mobile.changePage(\'#icePatient\');');
        iceButton.appendChild(document.createTextNode(' '));
        patDiv3.appendChild(iceButton);
        patDiv1.appendChild(patDiv3);

        patDiv0.appendChild(patDiv1);
        td.appendChild(patDiv0);
        tr.appendChild(td);
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    $('#patientListTable').trigger('create');
//    $('#patientListTable').table('refresh');
}

function removeIzTableRow(source) {
    var tr = getContainingTr(source);
    var izEntryTable = $('#izEntryTable')[0];
    var tbdy = izEntryTable.getElementsByTagName('tbody')[0];
    tbdy.removeChild(tr);
}

/**
 * Returns the containing TR node of the node passed in.
 * 
 * @param {type} source
 * @returns {getContainingTr.tr|tr.parentNode|tr.parentNode.parentNode}
 */
function getContainingTr(source) {
    var tr = source;
    var c = 0;
    while (tr.nodeName.toLowerCase() !== 'tr') {
        c++;
        tr = tr.parentNode;
        if (c === 10) {
            break;
        }
    }
    return tr;
}

function addIzRow() {
    var izEntryTable = $('#izEntryTable')[0];
    var tbdy = izEntryTable.getElementsByTagName('tbody')[0];
    appendIzTableRow(tbdy, []);
    $('#izEntryTable').trigger('create');
    $('#izEntryTable').table('refresh');
}

function appendIzTableRow(tbdy, data) {
    var eventType = 'I';
    if (data[3] !== null && typeof (data[3]) !== 'undefined' && data[3] !== '') {
        eventType = data[3];
    }

    var izId;
    if (data.length > 0) {
        izId = data[0];
    } else {
        izId = getGuid();
    }

    var tr = document.createElement('tr');

    // event type select
    td = document.createElement('td');
    td.setAttribute('class', 'izTypeSelect');
    var fieldset = document.createElement('fieldset');
    fieldset.setAttribute('data-role', 'controlgroup');
    fieldset.setAttribute('data-mini', 'true');
    fieldset.setAttribute('data-type', 'horizontal');
    fieldset.setAttribute('id', 'FS' + izId);
    var input = document.createElement('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('name', 'I' + izId);
    input.setAttribute('id', 'II' + izId);
    input.setAttribute('value', 'I');
    input.setAttribute('onchange', 'setIzCodeData(this);');
    if (eventType === 'I') {
        input.setAttribute('checked', 'checked');
    }
    fieldset.appendChild(input);
    var label = document.createElement('label');
    label.setAttribute('for', 'II' + izId);
    label.setAttribute('title', 'Immunization');
    label.appendChild(document.createTextNode('IZ'));
    fieldset.appendChild(label);
    input = document.createElement('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('name', 'I' + izId);
    input.setAttribute('id', 'ID' + izId);
    input.setAttribute('value', 'D');
    input.setAttribute('onchange', 'setIzCodeData(this);');
    if (eventType === 'D') {
        input.setAttribute('checked', 'checked');
    }
    fieldset.appendChild(input);
    label = document.createElement('label');
    label.setAttribute('for', 'ID' + izId);
    label.setAttribute('title', 'Disease');
    label.appendChild(document.createTextNode('Disease'));
    fieldset.appendChild(label);

    td.appendChild(fieldset);


    tr.appendChild(td);

    // code select
    td = document.createElement('td');
    td.setAttribute('class', 'izSelect');
//    td.setAttribute('data-rule-required', 'true');
    var codeInput = document.createElement('select');
    codeInput.name = 'CI' + izId;
    codeInput.id = codeInput.name;
    codeInput.setAttribute('data-mini', 'true');
//    codeInput.setAttribute('data-options', '{"hidePlaceholderMenuItems":"false"}');
//    codeInput.setAttribute('data-native-menu', 'false');
    td.appendChild(codeInput);
    var errorDiv = document.createElement('div');
    errorDiv.setAttribute('id', codeInput.id + 'Error');
    td.appendChild(errorDiv);
    tr.appendChild(td);

    // date input
    var td = document.createElement('td');
    td.setAttribute('class', 'iceDateInput');
//    td.setAttribute('data-rule-dateISO', 'true');
//    td.setAttribute('data-rule-required', 'true');
    var dateInput = document.createElement('input');
    dateInput.name = 'DI' + izId;
    dateInput.id = dateInput.name;
    dateInput.type = 'text';
    dateInput.size = 8;
    dateInput.setAttribute('data-role', 'datebox');
    dateInput.setAttribute('data-options', '{"mode":"datebox", "overrideDateFormat":"%Y%m%d", "useClearButton":"true", "useCollapsedBut":"true", "lockInput":"false", "enhanceInput":"true"}');
    if (data.length > 0) {
        dateInput.value = data[1];
    }
    td.appendChild(dateInput);
    var errorDiv = document.createElement('div');
    errorDiv.setAttribute('id', dateInput.id + 'Error');
    td.appendChild(errorDiv);
    tr.appendChild(td);

    // delete button
    td = document.createElement('td');
    td.setAttribute('class', 'izAction');
    var deleteButton = document.createElement('a');
    deleteButton.setAttribute('href', '#');
    deleteButton.setAttribute('onclick', 'removeIzTableRow(this);');
    deleteButton.setAttribute('class', 'ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all ui-shadow');
    deleteButton.setAttribute('title', 'Delete');
    deleteButton.appendChild(document.createTextNode('Delete'));
    td.appendChild(deleteButton);
    tr.appendChild(td);

    tbdy.appendChild(tr);
    $('#' + dateInput.id).rules('add', {'required': true});
    $('#' + dateInput.id).rules('add', {'dateISO': true});
    $('#' + codeInput.id).rules('add', {'required': true});

    _setIzCodeData(eventType, $('#' + codeInput.id)[0], data);
//    $('#FS' + izId).trigger('create');
//    $('#' + codeInput.id).trigger('create');
//    $('#' + dateInput.id).datebox({'mode': 'datebox', 'overrideDateFormat': '%Y%m%d', 'enhanceInput': 'true', 'lockInput': 'false'});
//    $('#' + dateInput.id).datebox('refresh');
}

function setIzCodeData(source) {
    var ciObject = $('#CI' + source.id.substring(2, source.id.length));
    ciObject.val('').selectmenu('refresh');
    _setIzCodeData(source.value, ciObject[0], []);
//    ciObject.value = '';
}

function _setIzCodeData(value, object, data) {
    var sourceDataItem;
    var sourceGroupDataItem;
    var sourceData;
    var elementSelected = false;

    //get the source data - iz or disease
    if (value === 'I') {
        sourceData = getVaccineGroupData();
    } else {
        sourceData = getDiseaseData();
    }

    // purge children on select menu
    while (object.firstChild) {
        object.removeChild(object.firstChild);
    }
    var option = document.createElement('option');
    option.setAttribute('value', '');
//    option.setAttribute('data-placeholder', 'true');
    option.appendChild(document.createTextNode('Choose one...'));
    object.appendChild(option);

    // add the option elements
    if (value === 'I') {
        for (sourceGroupDataItem in sourceData) {
            var vaccineList = sourceData[sourceGroupDataItem]['vaccineList'];
            var optgroup = document.createElement('optgroup');
            optgroup.setAttribute('label', sourceData[sourceGroupDataItem]['displayName']);
            for (var i = 0; i < vaccineList.length; i++) {
                sourceDataItem = vaccineList[i];
                var option = document.createElement('option');
                var label = sourceDataItem['selectName'];
                option.setAttribute('value', label);
                if (!elementSelected && data.length > 0 && data[2] === label) {
                    option.setAttribute('selected', 'selected');
                    elementSelected = true;
                }
                option.appendChild(document.createTextNode(label));
                optgroup.appendChild(option);
            }
            object.appendChild(optgroup);
        }
    } else {
        for (sourceDataItem in sourceData) {
            var option = document.createElement('option');
            var label = sourceData[sourceDataItem]['selectName'];
            option.setAttribute('value', label);
            if (data.length > 0 && data[2] === label) {
                option.setAttribute('selected', 'selected');
            }
            option.appendChild(document.createTextNode(label));
            object.appendChild(option);
        }
    }
}

/**
 * Things to call after all assets are loaded.
 * 
 */
$(document).ready(function() {
    /**
     * Update the delete confirm dialog contents each time it is displayed.
     */
    $('#deleteConfirm').on("pagecreate", function(event, ui) {
        var patient = getPatientList()[getSelectedPatient()];
        $('#deleteConfirmMessage').empty()
                .append('Are you sure you want to delete patient "' + patient['firstName'] + ' ' + patient['lastName'] + '"?');
    });

    /**
     * Patient file import event.
     */
    $('#importPatientInput').on('change', function(event, ui) {
        file = event.target.files[0];

        var reader = new FileReader();
        reader.onload = (function(theFile) {
            return function(e) {
                importPatient(e.target.result);
                currentPage = 'main';
                document.location.href = '#main';
                location.reload();
            };
        })(file);
        reader.readAsDataURL(file);
    });
});

function importPatient(data) {
    var patients = [];
    var payload = atob(decodeURIComponent(data.substring(data.indexOf(',') + 1)));
    try {
        patients = [].concat(JSON.parse(payload));
    } catch (err) {
        var xmlDoc = (new DOMParser()).parseFromString(payload, 'application/xml');
        var patientNodes = xmlDoc.documentElement.getElementsByTagName('patient');
        if (typeof (console) !== 'undefined' && typeof (console.log) !== 'undefined') {
            console.log(patientNodes);
        }
        for (var i = 0; i < patientNodes.length; i++) {
            patients[patients.length] = vmr2Js(patientNodes[i]);
        }
    }
    var patientList = getPatientList();
    for (var c = 0; c < patients.length; c++) {
        var patient = patients[c];
        patient['id'] = getGuid();
        patientList[patient['id']] = patient;
    }
    setPatientList(patientList);
}

function initPatientValidation() {

//    console.log('called initPatientValidation');

    $.validator.addMethod("dateISO", function(value, element) {
        return this.optional(element) || /^\d{4}(0?[1-9]|1[012])(0?[1-9]|[12][0-9]|3[01])$/.test(value);
    }, "Please specify a valid date. e.g. 19301231");

    $('#savePatientForm').validate({
        onfocusout: function(element, event) {
            var id = '#' + element.id;
            if (!$("#savePatientForm").validate().element(id)) {
                $(id + 'Error').show();
            } else {
                $(id + 'Error').hide();
            }
        },
        errorPlacement: function(error, element) {
//            console.log($('#' + element[0].id + 'Error'));
            error.appendTo($('#' + element[0].id + 'Error'));
        }
    });
}
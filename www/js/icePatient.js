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
        izs[izs.length] = [inputs[0].name.substring(2, inputs[0].name.length),
            inputs[0].value,
            inputs[1].value]
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
    document.location.href = '#main';
    location.reload();
}

function editPatient(patientId) {
    var patient = getPatientList()[patientId];

    $('#patientId')[0].value = patientId;

    $('#firstName')[0].value = patient['firstName'];
    $('#lastName')[0].value = patient['lastName'];

    $('input[name="gender"][value="' + patient['gender'] + '"]').prop('checked', true);

    $('#dob')[0].value = patient['dob'];

    if (patient['evalDate'] !== null && typeof (patient['evalDate']) !== 'undefined' && patient['evalDate'] !== '') {
        $('#evalDate')[0].value = patient['evalDate'];
    }

    var izEntryTable = $('#izEntryTable')[0];
    var tbdy = izEntryTable.getElementsByTagName('tbody')[0];
    for (var i = 0; i < patient['izs'].length; i++) {
        appendIzTableRow(tbdy, patient['izs'][i]);
    }
}

function deletePatient(patientId) {
    var patientList = getPatientList();
    delete patientList[patientId];
    setPatientList(patientList);
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
        patDiv1.appendChild(document.createTextNode(patient['dob']));
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
        izTbl.setAttribute('class', 'ui-responsive table-stroke izTable');
        var izThead = document.createElement('thead');
        var izTr = document.createElement('tr');
        var izTh = document.createElement('th');
        izTh.appendChild(document.createTextNode('Date'));
        izTr.appendChild(izTh);
        izTh = document.createElement('th');
        izTh.appendChild(document.createTextNode('CVX Code'));
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
                    izTd.appendChild(document.createTextNode(iz[1]));
                    izTr.appendChild(izTd);
                    izTd = document.createElement('td');
                    izTd.appendChild(document.createTextNode(iz[2]));
                    izTr.appendChild(izTd);
                    izTbody.appendChild(izTr);
                }
            }
        }
        izTbl.appendChild(izTbody);

        patDiv2.appendChild(izTbl);
        patDiv0.appendChild(patDiv2);

        /**
         * Action buttons
         */
        patDiv3 = document.createElement('div');
        patDiv3.setAttribute('class', 'floatRight');

        exportButton = document.createElement('a');
        exportButton.setAttribute('class', 'ui-btn ui-icon-arrow-d ui-btn-icon-notext ui-corner-all ui-shadow floatLeft');
        exportButton.setAttribute('title', 'Export Patient');
        exportButton.setAttribute('download', key + '.json');
        exportButton.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(patient)));
        exportButton.appendChild(document.createTextNode(' '));
        patDiv3.appendChild(exportButton);

        editButton = document.createElement('a');
        editButton.setAttribute('class', 'ui-btn ui-icon-edit ui-btn-icon-notext ui-corner-all ui-shadow floatLeft');
        editButton.setAttribute('title', 'Edit');
        editButton.setAttribute('href', '#savePatient');
        editButton.setAttribute('onclick', 'editPatient(\'' + key + '\');$.mobile.changePage(\'#savePatient\');');
        editButton.appendChild(document.createTextNode(' '));
        patDiv3.appendChild(editButton);

        deleteButton = document.createElement('a');
        deleteButton.setAttribute('class', 'ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all ui-shadow floatLeft');
        deleteButton.setAttribute('title', 'Delete');
        deleteButton.setAttribute('href', '#deleteConfirm');
        deleteButton.setAttribute('data-transition', 'pop');
        deleteButton.setAttribute('data-rel', 'dialog');
        deleteButton.setAttribute('onclick', 'setSelectedPatient(\'' + key + '\');$.mobile.changePage(\'#deleteConfirm\');');
        deleteButton.appendChild(document.createTextNode(' '));
        patDiv3.appendChild(deleteButton);

        iceButton = document.createElement('a');
        iceButton.setAttribute('class', 'ui-btn ui-icon-action ui-btn-icon-notext ui-corner-all ui-shadow floatLeft');
        iceButton.setAttribute('title', 'ICE Patient');
        iceButton.setAttribute('href', '#icePatient');
        iceButton.setAttribute('data-transition', 'pop');
        iceButton.setAttribute('data-rel', 'dialog');
        iceButton.setAttribute('onclick', 'icePatient(\'' + key + '\');$.mobile.changePage(\'#icePatient\');');
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
}

function removeIzTableRow(source) {
    var tr = source;
    var c = 0;
    while (tr.nodeName.toLowerCase() !== 'tr') {
        c++;
        tr = tr.parentNode;
        if (c === 10) {
            break;
        }
    }
    var izEntryTable = $('#izEntryTable')[0];
    var tbdy = izEntryTable.getElementsByTagName('tbody')[0];
    tbdy.removeChild(tr);
}

function addIzRow() {
    var izEntryTable = $('#izEntryTable')[0];
    var tbdy = izEntryTable.getElementsByTagName('tbody')[0];
    appendIzTableRow(tbdy, []);
    $('#izEntryTable').trigger('create');
}

function appendIzTableRow(tbdy, data) {
    var tr = document.createElement('tr');

    var izId;
    if (data.length > 0) {
        izId = data[0];
    } else {
        izId = getGuid();
    }

    var td = document.createElement('td');
    var dateInput = document.createElement('input');
    dateInput.name = 'DI' + izId;
    dateInput.id = dateInput.name;
    dateInput.type = 'text';
    dateInput.setAttribute('data-role', 'date');
    if (data.length > 0) {
        dateInput.value = data[1];
    }
    td.appendChild(dateInput);
    tr.appendChild(td);

    td = document.createElement('td');
    var cvxInput = document.createElement('input');
    cvxInput.name = 'CI' + izId;
    cvxInput.id = cvxInput.name;
    cvxInput.type = 'text';
    cvxInput.setAttribute('class', 'cvxAutoComplete');
    if (data.length > 0) {
        cvxInput.value = data[2];
    }
    td.appendChild(cvxInput);
    tr.appendChild(td);

    td = document.createElement('td');
    var deleteButton = document.createElement('a');
    deleteButton.setAttribute('href', '#');
    deleteButton.setAttribute('onclick', 'removeIzTableRow(this);');
    deleteButton.setAttribute('class', 'ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all ui-shadow');
    deleteButton.setAttribute('title', 'Delete');
    deleteButton.appendChild(document.createTextNode('Delete'));
    td.appendChild(deleteButton);
    tr.appendChild(td);

    tbdy.appendChild(tr);

    $('#' + cvxInput.id).autocomplete({
        source: getCvxData(),
        minLength: 0
    }).focus(function() {
        $(this).autocomplete("search");
    });
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
                document.location.href = '#main';
                location.reload();
            };
        })(file);
        reader.readAsDataURL(file);
    });
});

function importPatient(data) {
    var payload = atob(decodeURIComponent(data.substring(data.indexOf(',') + 1)));
    var patient;
    try {
        patient = JSON.parse(payload);
    } catch (err) {
        var xmlDoc = (new DOMParser()).parseFromString(payload, 'application/xml');
        patient = vmr2Js(xmlDoc);
    }
    patient['id'] = getGuid();
    var patientList = getPatientList();
    patientList[patient['id']] = patient;
    setPatientList(patientList);
}

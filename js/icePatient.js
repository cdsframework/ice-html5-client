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

    var iz1Id = getGuid();
    var iz1a = $('#iz1a')[0].value;
    var iz1b = $('#iz1b')[0].value;

    var iz2Id = getGuid();
    var iz2a = $('#iz2a')[0].value;
    var iz2b = $('#iz2b')[0].value;

    var iz3Id = getGuid();
    var iz3a = $('#iz3a')[0].value;
    var iz3b = $('#iz3b')[0].value;

    var iz4Id = getGuid();
    var iz4a = $('#iz4a')[0].value;
    var iz4b = $('#iz4b')[0].value;

    var iz5Id = getGuid();
    var iz5a = $('#iz5a')[0].value;
    var iz5b = $('#iz5b')[0].value;

    var iz6Id = getGuid();
    var iz6a = $('#iz6a')[0].value;
    var iz6b = $('#iz6b')[0].value;

    var iz7Id = getGuid();
    var iz7a = $('#iz7a')[0].value;
    var iz7b = $('#iz7b')[0].value;

    var iz8Id = getGuid();
    var iz8a = $('#iz8a')[0].value;
    var iz8b = $('#iz8b')[0].value;

    var iz9Id = getGuid();
    var iz9a = $('#iz9a')[0].value;
    var iz9b = $('#iz9b')[0].value;

    var iz10Id = getGuid();
    var iz10a = $('#iz10a')[0].value;
    var iz10b = $('#iz10b')[0].value;

    var patient = {
        'firstName': firstName,
        'lastName': lastName,
        'gender': gender,
        'dob': dob,
        'id': patientId,
        'izs': [
            [iz1Id, iz1a, iz1b],
            [iz2Id, iz2a, iz2b],
            [iz3Id, iz3a, iz3b],
            [iz4Id, iz4a, iz4b],
            [iz5Id, iz5a, iz5b],
            [iz6Id, iz6a, iz6b],
            [iz7Id, iz7a, iz7b],
            [iz8Id, iz8a, iz8b],
            [iz9Id, iz9a, iz9b],
            [iz10Id, iz10a, iz10b]
        ]
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

    $('#iz1a')[0].value = patient['izs'][0][1];
    $('#iz1b')[0].value = patient['izs'][0][2];

    $('#iz2a')[0].value = patient['izs'][1][1];
    $('#iz2b')[0].value = patient['izs'][1][2];

    $('#iz3a')[0].value = patient['izs'][2][1];
    $('#iz3b')[0].value = patient['izs'][2][2];

    $('#iz4a')[0].value = patient['izs'][3][1];
    $('#iz4b')[0].value = patient['izs'][3][2];

    $('#iz5a')[0].value = patient['izs'][4][1];
    $('#iz5b')[0].value = patient['izs'][4][2];

    $('#iz6a')[0].value = patient['izs'][5][1];
    $('#iz6b')[0].value = patient['izs'][5][2];

    $('#iz7a')[0].value = patient['izs'][6][1];
    $('#iz7b')[0].value = patient['izs'][6][2];

    $('#iz8a')[0].value = patient['izs'][7][1];
    $('#iz8b')[0].value = patient['izs'][7][2];

    $('#iz9a')[0].value = patient['izs'][8][1];
    $('#iz9b')[0].value = patient['izs'][8][2];

    $('#iz10a')[0].value = patient['izs'][9][1];
    $('#iz10b')[0].value = patient['izs'][9][2];
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
        exportButton.setAttribute('alt', 'Export Patient');
        exportButton.setAttribute('download', key + '.json');
        exportButton.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(patient)));
        exportButton.appendChild(document.createTextNode(' '));
        patDiv3.appendChild(exportButton);

        editButton = document.createElement('a');
        editButton.setAttribute('class', 'ui-btn ui-icon-edit ui-btn-icon-notext ui-corner-all ui-shadow floatLeft');
        editButton.setAttribute('title', 'Edit');
        editButton.setAttribute('alt', 'Edit');
        editButton.setAttribute('href', '#savePatient');
        editButton.setAttribute('onclick', 'editPatient(\'' + key + '\');$.mobile.changePage(\'#savePatient\');');
        editButton.appendChild(document.createTextNode(' '));
        patDiv3.appendChild(editButton);

        deleteButton = document.createElement('a');
        deleteButton.setAttribute('class', 'ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all ui-shadow floatLeft');
        deleteButton.setAttribute('title', 'Delete');
        deleteButton.setAttribute('alt', 'Delete');
        deleteButton.setAttribute('href', '#deleteConfirm');
        deleteButton.setAttribute('data-transition', 'pop');
        deleteButton.setAttribute('data-rel', 'dialog');
        deleteButton.setAttribute('onclick', 'setSelectedPatient(\'' + key + '\');$.mobile.changePage(\'#deleteConfirm\');');
        deleteButton.appendChild(document.createTextNode(' '));
        patDiv3.appendChild(deleteButton);

        iceButton = document.createElement('a');
        iceButton.setAttribute('class', 'ui-btn ui-icon-action ui-btn-icon-notext ui-corner-all ui-shadow floatLeft');
        iceButton.setAttribute('title', 'ICE Patient');
        iceButton.setAttribute('alt', 'ICE Patient');
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
                var result = e.target.result;
                var patientData = atob(decodeURIComponent(result.substring(result.indexOf(',') + 1)));
                var patient = JSON.parse(patientData);
                var newGuid = getGuid();
                patient['id'] = newGuid;
                var patientList = getPatientList();
                patientList[newGuid] = patient;
                setPatientList(patientList);
                document.location.href = '#main';
                location.reload();
            };
        })(file);
        reader.readAsDataURL(file);
    });
});

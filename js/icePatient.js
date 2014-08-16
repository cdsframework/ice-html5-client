/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function addPatient() {
    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;

    var gender = $('input[name="gender"]:checked').val();

    var dob = document.getElementById('dob').value;
    var id = getGuid();

    var iz1Id = getGuid();
    var iz1a = document.getElementById('iz1a').value;
    var iz1b = document.getElementById('iz1b').value;

    var iz2Id = getGuid();
    var iz2a = document.getElementById('iz2a').value;
    var iz2b = document.getElementById('iz2b').value;

    var iz3Id = getGuid();
    var iz3a = document.getElementById('iz3a').value;
    var iz3b = document.getElementById('iz3b').value;

    var iz4Id = getGuid();
    var iz4a = document.getElementById('iz4a').value;
    var iz4b = document.getElementById('iz4b').value;

    var iz5Id = getGuid();
    var iz5a = document.getElementById('iz5a').value;
    var iz5b = document.getElementById('iz5b').value;

    var iz6Id = getGuid();
    var iz6a = document.getElementById('iz6a').value;
    var iz6b = document.getElementById('iz6b').value;

    var iz7Id = getGuid();
    var iz7a = document.getElementById('iz7a').value;
    var iz7b = document.getElementById('iz7b').value;


    var iz8Id = getGuid();
    var iz8a = document.getElementById('iz8a').value;
    var iz8b = document.getElementById('iz8b').value;


    var iz9Id = getGuid();
    var iz9a = document.getElementById('iz9a').value;
    var iz9b = document.getElementById('iz9b').value;


    var iz10Id = getGuid();
    var iz10a = document.getElementById('iz10a').value;
    var iz10b = document.getElementById('iz10b').value;

    var patient = {
        'firstName': firstName,
        'lastName': lastName,
        'gender': gender,
        'dob': dob,
        'id': id,
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
    var patientList = JSON.parse(localStorage.getItem('patientList'));
//    console.log(patientList);
    if (patientList === null) {
        localStorage.setItem('patientList', JSON.stringify({}));
        patientList = JSON.parse(localStorage.getItem('patientList'));
    }
    patientList[id] = patient;
    localStorage.setItem('patientList', JSON.stringify(patientList));
    document.location.href = '#main';
    location.reload();
}

function deletePatient(id) {
    var patientList = JSON.parse(localStorage.getItem('patientList'));
    delete patientList[id];
    localStorage.setItem('patientList', JSON.stringify(patientList));
    document.location.href = '#main';
    location.reload();
}

function listPatients() {
    var tbl = document.getElementById('patientListTable');
    var tbdy = tbl.getElementsByTagName('tbody')[0];
    while (tbdy.firstChild) {
        tbdy.removeChild(tbdy.firstChild);
    }
    var tr, td, span, patDiv0, patDiv1, patDiv2, patA, patP, editButton, deleteButton, iceButton;
    if (localStorage.getItem('patientList') === '{}' || localStorage.getItem('patientList') === null || localStorage.getItem('patientList') === '') {
        localStorage.setItem('patientList', defaultPatientList);
    }
    var patientList = JSON.parse(localStorage.getItem('patientList'));
    // console.log(patientList);
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

        span = document.createElement('span');
        span.setAttribute('class', 'inline-label');
        span.appendChild(document.createTextNode(' Gender: '));

        patDiv1.appendChild(span);
        patDiv1.appendChild(document.createTextNode(patient['gender']));
        patDiv1.appendChild(document.createElement('br'));


        patA = document.createElement('a');
        patA.setAttribute('href', '#PAT' + key);
        patA.setAttribute('data-rel', 'popup');
        patA.setAttribute('data-transition', 'pop');
        patA.setAttribute('title', 'Immunizations');
        patA.setAttribute('class', 'my-tooltip-btn ui-btn ui-alt-icon ui-nodisc-icon ui-btn-inline ui-icon-info ui-btn-icon-notext');
        patDiv1.appendChild(patA);
        patDiv0.appendChild(patDiv1);


        patDiv2 = document.createElement('div');
        patDiv2.setAttribute('class', 'ui-content');
        patDiv2.setAttribute('data-role', 'popup');
        patDiv2.setAttribute('id', 'PAT' + key);

        patP = document.createElement('p');

        for (var i = 0; i < patient['izs'].length; i++) {
            var iz = patient['izs'][i];
            if (iz[1] !== null && iz[1] !== '') {
                patP.appendChild(document.createTextNode(iz[1] + '/' + iz[2] + ';'));
                patP.appendChild(document.createElement('br'));
            }
        }

        patDiv2.appendChild(patP);
        patDiv0.appendChild(patDiv2);
        td.appendChild(patDiv0);
        tr.appendChild(td);

        td = document.createElement('td');
        editButton = document.createElement('button');
        editButton.setAttribute('class', 'centerDiv');
        editButton.setAttribute('title', 'Edit');
        editButton.setAttribute('value', ' ');
        editButton.setAttribute('data-icon', 'edit');
        editButton.setAttribute('data-iconpos', 'notext');
        editButton.setAttribute('onclick', 'editPatient(\'' + key + '\');return false;');
        editButton.appendChild(document.createTextNode(' '));
        td.appendChild(editButton);
        tr.appendChild(td);

        td = document.createElement('td');
        deleteButton = document.createElement('button');
        deleteButton.setAttribute('class', 'centerDiv');
        deleteButton.setAttribute('title', 'Delete');
        deleteButton.setAttribute('value', ' ');
        deleteButton.setAttribute('data-icon', 'delete');
        deleteButton.setAttribute('data-iconpos', 'notext');
        deleteButton.setAttribute('onclick', 'deletePatient(\'' + key + '\');return false;');
        deleteButton.appendChild(document.createTextNode(' '));
        td.appendChild(deleteButton);
        tr.appendChild(td);

        td = document.createElement('td');
        iceButton = document.createElement('button');
        iceButton.setAttribute('class', 'centerDiv');
        iceButton.setAttribute('title', 'ICE Patient');
        iceButton.setAttribute('value', ' ');
        iceButton.setAttribute('data-icon', 'action');
        iceButton.setAttribute('data-iconpos', 'notext');
        iceButton.setAttribute('onclick', 'icePatient(\'' + key + '\');return false;');
        iceButton.appendChild(document.createTextNode(' '));
        td.appendChild(iceButton);
        tr.appendChild(td);
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    $('#patientListTable').trigger('create');
}

function renderGrid(responseJs) {
    document.getElementById('iceOutputGrid').style.display = 'block';
    var tbl = document.getElementById('iceOutputGrid');

    var tbdy = tbl.getElementsByTagName('tbody')[0];
    while (tbdy.firstChild) {
        tbdy.removeChild(tbdy.firstChild);
    }
    var tr, td, eval, rec;

    var groupKey;
    for (groupKey in responseJs) {
        tr = document.createElement('tr');

        td = document.createElement('td');
        td.appendChild(document.createTextNode(responseJs[groupKey]['groupName']));
        tr.appendChild(td);

        td = document.createElement('td');
        rec = renderRecommendations(groupKey, responseJs[groupKey]['recommendations']);
        td.appendChild(rec);
        tr.appendChild(td);

        td = document.createElement('td');
        eval = renderEvaluations(groupKey, responseJs[groupKey]['evaluations']);
        td.appendChild(eval);
        tr.appendChild(td);

        tbdy.appendChild(tr);

        $('#iceOutputGrid').trigger('create');
    }
}

function renderEvaluations(groupKey, evaluations) {
    var evalTbl, evalTr, evalTd, evalDiv1, evalP, evalA, evalDiv2, evaluation, evaluationKey;

    evalTbl = document.createElement('table');
    evalTbl.setAttribute('class', 'iceEvalTable');
    evalTbl.setAttribute('cellpadding', '0');
    evalTbl.setAttribute('cellspacing', '0');
    evalTr = document.createElement('tr');

    for (var i = 0; i < evaluations.length; i++) {
        evaluation = evaluations[i];
        evalTd = document.createElement('td');
        evalTd.setAttribute('style', 'border-bottom: 0px;padding: 1px;');

        evalDiv1 = document.createElement('div');
        if (evaluation['isValid'] === 'false') {
            evalDiv1.setAttribute('class', 'ui-shadow iceEvalSquare iceEvalFalse');
        } else {
            evalDiv1.setAttribute('class', 'ui-shadow iceEvalSquare iceEvalTrue');
        }
        evalDiv1.appendChild(document.createTextNode('Date: ' + evaluation['administrationTime']));
        evalDiv1.appendChild(document.createElement('br'));
        evalDiv1.appendChild(document.createTextNode('Vaccine: ' + cvxData[evaluation['substanceCode']]['displayName'] + ' (' + evaluation['substanceCode'] + ')'));
        evalDiv1.appendChild(document.createElement('br'));
        evalDiv1.appendChild(document.createTextNode('Age: '));
        evalDiv1.appendChild(document.createElement('br'));
        evalDiv1.appendChild(document.createTextNode('Valid: ' + evaluation['isValid']));

        evalA = document.createElement('a');
        evalA.setAttribute('href', '#eval' + i + '' + groupKey);
        evalA.setAttribute('data-rel', 'popup');
        evalA.setAttribute('data-transition', 'pop');
        evalA.setAttribute('title', 'Details');
        evalA.setAttribute('class', 'my-tooltip-btn ui-btn ui-alt-icon ui-nodisc-icon ui-btn-inline ui-icon-info ui-btn-icon-notext');
        evalDiv1.appendChild(evalA);
        evalTd.appendChild(evalDiv1);


        evalDiv2 = document.createElement('div');
        evalDiv2.setAttribute('class', 'ui-content');
        evalDiv2.setAttribute('data-role', 'popup');
        evalDiv2.setAttribute('id', 'eval' + i + '' + groupKey);

        evalP = document.createElement('p');

        for (evaluationKey in evaluation) {
            evalP.appendChild(document.createTextNode(evaluationKey + ': ' + evaluation[evaluationKey]));
            evalP.appendChild(document.createElement('br'));
        }

        evalDiv2.appendChild(evalP);

        evalTd.appendChild(evalDiv2);
        evalTr.appendChild(evalTd);
    }
    evalTbl.appendChild(evalTr);
    return evalTbl;
}

function renderRecommendations(groupKey, recommendations) {
    var recommendation, recDiv0, recDiv1, recP, recA, recDiv2, recommendationKey;

    recDiv0 = document.createElement('div');

    if (recommendations.length > 0) {

        recommendation = recommendations[0];

        recDiv1 = document.createElement('div');
        if (recommendation['concept'] === 'RECOMMENDED') {
            recDiv1.setAttribute('class', 'ui-shadow iceRecSquare iceRecommended');
        } else {
            recDiv1.setAttribute('class', 'ui-shadow iceRecSquare');
        }

        if (recommendation['administrationTime'] !== '') {
            recDiv1.appendChild(document.createTextNode('Date: ' + recommendation['administrationTime']));
            recDiv1.appendChild(document.createElement('br'));
        }

        if (recommendation['substanceCodeType'] === 'VACCINE') {
            recDiv1.appendChild(document.createTextNode('Vaccine: ' + cvxData[recommendation['substanceCode']]['displayName'] + ' (' + recommendation['substanceCode'] + ')'));
        } else {
            recDiv1.appendChild(document.createTextNode('Vaccine Group: ' + vaccineGroups[recommendation['substanceCode']]));
        }
        recDiv1.appendChild(document.createElement('br'));

        recDiv1.appendChild(document.createTextNode('Status: ' + recommendation['concept']));
        recDiv1.appendChild(document.createElement('br'));

        recDiv1.appendChild(document.createTextNode('Message: ' + recommendation['interpretations']));

        recA = document.createElement('a');
        recA.setAttribute('href', '#rec' + groupKey);
        recA.setAttribute('data-rel', 'popup');
        recA.setAttribute('data-transition', 'pop');
        recA.setAttribute('title', 'Details');
        recA.setAttribute('class', 'my-tooltip-btn ui-btn ui-alt-icon ui-nodisc-icon ui-btn-inline ui-icon-info ui-btn-icon-notext');
        recDiv1.appendChild(recA);
        recDiv0.appendChild(recDiv1);


        recDiv2 = document.createElement('div');
        recDiv2.setAttribute('class', 'ui-content');
        recDiv2.setAttribute('data-role', 'popup');
        recDiv2.setAttribute('id', 'rec' + groupKey);

        recP = document.createElement('p');

        for (recommendationKey in recommendation) {
            recP.appendChild(document.createTextNode(recommendationKey + ': ' + recommendation[recommendationKey]));
            recP.appendChild(document.createElement('br'));
        }

        recDiv2.appendChild(recP);

        recDiv0.appendChild(recDiv2);
    }

    return recDiv0;
}
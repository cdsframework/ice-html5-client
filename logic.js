/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var getGuid = (function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
    }
    return function() {
//        return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
    };
})();
function addPatient() {
    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;
    var gender = document.getElementById('gender').value;
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
    console.log(patientList);
    if (patientList === null) {
        localStorage.setItem('patientList', JSON.stringify({}));
        patientList = JSON.parse(localStorage.getItem('patientList'));
    }
    patientList[id] = patient;
    localStorage.setItem('patientList', JSON.stringify(patientList));
    document.location.href = 'home.html';
}

function deletePatient(id) {
    var patientList = JSON.parse(localStorage.getItem('patientList'));
    delete patientList[id];
    localStorage.setItem('patientList', JSON.stringify(patientList));
    document.location.href = 'home.html';
}

function listPatients() {
    var tbl = document.createElement('table');
//    tbl.style.width = '100%';
    tbl.setAttribute('border', '1');
    tbl.setAttribute('cellspacing', '0');
    tbl.setAttribute('style', 'border-collapse: collapse;');
    var tbdy = document.createElement('tbody');
    var tr = document.createElement('tr');
    var th = document.createElement('th');
    th.appendChild(document.createTextNode("ID"));
    tr.appendChild(th);
    th = document.createElement('th');
    th.appendChild(document.createTextNode("First Name"));
    tr.appendChild(th);
    th = document.createElement('th');
    th.appendChild(document.createTextNode("Last Name"));
    tr.appendChild(th);
    th = document.createElement('th');
    th.appendChild(document.createTextNode("Gender"));
    tr.appendChild(th);
    th = document.createElement('th');
    th.appendChild(document.createTextNode("DOB"));
    tr.appendChild(th);
    th = document.createElement('th');
    th.appendChild(document.createTextNode("IZs"));
    tr.appendChild(th);
    th = document.createElement('th');
    th.appendChild(document.createTextNode("Delete"));
    tr.appendChild(th);
    th = document.createElement('th');
    th.appendChild(document.createTextNode("ICE"));
    tr.appendChild(th);
    tbdy.appendChild(tr);
    var td, deleteButton;
    var patientListTable = document.getElementById('patientListTable');
    var patientList = JSON.parse(localStorage.getItem('patientList'));
    console.log(patientList);
    for (var key in patientList) {
        var patient = patientList[key];
        tr = document.createElement('tr');
        td = document.createElement('td');
        td.appendChild(document.createTextNode(key));
        tr.appendChild(td);
        td = document.createElement('td');
        td.appendChild(document.createTextNode(patient['firstName']));
        tr.appendChild(td);
        td = document.createElement('td');
        td.appendChild(document.createTextNode(patient['lastName']));
        tr.appendChild(td);
        td = document.createElement('td');
        td.appendChild(document.createTextNode(patient['gender']));
        tr.appendChild(td);
        td = document.createElement('td');
        td.appendChild(document.createTextNode(patient['dob']));
        tr.appendChild(td);
        td = document.createElement('td');
        td.appendChild(document.createTextNode(JSON.stringify(patient['izs'])));
        tr.appendChild(td);
        td = document.createElement('td');
        deleteButton = document.createElement('button');
        deleteButton.setAttribute('name', 'Delete');
        deleteButton.setAttribute('onclick', 'deletePatient(\'' + key + '\');return false;');
        deleteButton.appendChild(document.createTextNode('Delete'));
        td.appendChild(deleteButton);
        tr.appendChild(td);
        td = document.createElement('td');
        deleteButton = document.createElement('button');
        deleteButton.setAttribute('name', 'ice');
        deleteButton.setAttribute('onclick', 'icePatient(\'' + key + '\');return false;');
        deleteButton.appendChild(document.createTextNode('ICE'));
        td.appendChild(deleteButton);
        tr.appendChild(td);
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    patientListTable.appendChild(tbl);
}

function icePatient(id) {
    var patientList = JSON.parse(localStorage.getItem('patientList'));
    var patient = patientList[id];
    var input = document.getElementById('input');
    var xmlString = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            + '<ns3:cdsInput xmlns:ns2="org.opencds.vmr.v1_0.schema.vmr" xmlns:ns3="org.opencds.vmr.v1_0.schema.cdsinput">'
            + '<templateId root="2.16.840.1.113883.3.795.11.1.1"/>'
            + '<cdsContext>'
            + '<cdsSystemUserPreferredLanguage code="en" codeSystem="2.16.840.1.113883.6.99" displayName="English"/>'
            + '</cdsContext>'
            + '<vmrInput>'
            + '<templateId root="2.16.840.1.113883.3.795.11.1.1"/>'
            + '<patient>'
            + '<templateId root="2.16.840.1.113883.3.795.11.2.1.1"/>'
            + '<id root="2.16.840.1.113883.3.795.12.100.11" extension="' + id + '"/>'
            + '<demographics>'
            + '<birthTime value="' + patient['dob'] + '"/>'
            + '<gender code="' + patient['gender'] + '" codeSystem="2.16.840.1.113883.5.1" />'
            + '</demographics>'
            + '<clinicalStatements>'
            + '<observationResults>'
            + '</observationResults>'
            + '<substanceAdministrationEvents>';
    var izs = patient['izs'];
    for (var i = 0; i < izs.length; i++) {
        xmlString = addsubstanceAdministrationEvent(xmlString, izs[i]);
    }

    xmlString += '</substanceAdministrationEvents>'
            + '</clinicalStatements>'
            + '</patient>'
            + '</vmrInput>'
            + '</ns3:cdsInput>';
    var xmlDoc = (new DOMParser()).parseFromString(xmlString, 'application/xml');
    var serializer = new XMLSerializer();
    var inputXml = formatXml(serializer.serializeToString(xmlDoc));
    input.appendChild(document.createTextNode(inputXml));
    evaluate(inputXml);
}

function addsubstanceAdministrationEvent(xmlString, iz) {
    if (iz[2] !== null && iz[2] !== '') {
    xmlString += '<substanceAdministrationEvent>'
            + '<templateId root="2.16.840.1.113883.3.795.11.9.1.1"/>'
            + '<id root="2.16.840.1.113883.3.795.12.100.10" extension="' + iz[0] + '"/>'
            + '<substanceAdministrationGeneralPurpose code="384810002" codeSystem="2.16.840.1.113883.6.5"/>'
            + '<substance>'
            + '<id root="' + getGuid() + '"/>'
            + '<substanceCode code="' + iz[2] + '" codeSystem="2.16.840.1.113883.12.292" />'
            + '</substance>'
            + '<administrationTimeInterval low="' + iz[1] + '" high="' + iz[1] + '"/>'
            + '</substanceAdministrationEvent>';
    }
    return xmlString;
}

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);

    } else if (typeof XDomainRequest !== "undefined") {

        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url, true);

    } else {

        // Otherwise, CORS is not supported by the browser.
        xhr = null;

    }
    return xhr;
}

function evaluate(inputXml) {
    var xhr = createCORSRequest('POST', 'http://cds.hln.com/opencds-decision-support-service-1.0.0-SNAPSHOT/evaluate');
    var soapRequestNode = document.getElementById('soapRequest');

    // build SOAP request
    var sr =
            '<?xml version="1.0" encoding="utf-8"?>' +
            '<S:Envelope xmlns:S="http://www.w3.org/2003/05/soap-envelope">' +
            '<S:Body>' +
            '<ns2:evaluateAtSpecifiedTime xmlns:ns2="http://www.omg.org/spec/CDSS/201105/dss">' +
            '<interactionId scopingEntityId="gov.nyc.health" interactionId="123456"/>' +
            '<specifiedTime>2012-01-14T00:00:00.000-05:00</specifiedTime>' +
            '<evaluationRequest clientLanguage="" clientTimeZoneOffset="">' +
            '<kmEvaluationRequest>' +
            '<kmId scopingEntityId="org.nyc.cir" businessId="ICE" version="1.0.0"/>' +
            '</kmEvaluationRequest>' +
            '<dataRequirementItemData>' +
            '<driId itemId="cdsPayload">' +
            '<containingEntityId scopingEntityId="gov.nyc.health" businessId="ICEData" version="1.0.0.0"/>' +
            '</driId>' +
            '<data>' +
            '<informationModelSSId scopingEntityId="org.opencds.vmr" businessId="VMR" version="1.0"/>' +
            '<base64EncodedPayload>' + btoa(inputXml) + '</base64EncodedPayload>' +
            '</data>' +
            '</dataRequirementItemData>' +
            '</evaluationRequest>' +
            '</ns2:evaluateAtSpecifiedTime>' +
            '</S:Body>' +
            '</S:Envelope>';

    soapRequestNode.appendChild(document.createTextNode(formatXml(sr)));

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var soapResponseNode = document.getElementById('soapResponse');
                var xmlDoc = (new DOMParser()).parseFromString(xhr.responseText, 'application/xml');
                var serializer = new XMLSerializer();
                var outputXml = formatXml(serializer.serializeToString(xmlDoc));
                soapResponseNode.appendChild(document.createTextNode(outputXml));
                processResponse(xmlDoc);
            }
        }
    };

    //     Send the POST request
    xhr.setRequestHeader('Content-Type', 'text/xml');
    xhr.send(sr);
}

function processResponse(xmlDoc) {
    var outputNode = document.getElementById('output');
    var base64EncodedPayload = xmlDoc.getElementsByTagName('base64EncodedPayload')[0];
    outputNode.appendChild(document.createTextNode(atob(base64EncodedPayload.childNodes[0].nodeValue)));
}

function formatXml(xml) {
    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;
    jQuery.each(xml.split('\r\n'), function(index, node) {
        var indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
        } else if (node.match(/^<\/\w/)) {
            if (pad !== 0) {
                pad -= 1;
            }
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
            indent = 1;
        } else {
            indent = 0;
        }

        var padding = '';
        for (var i = 0; i < pad; i++) {
            padding += '  ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });
    return formatted;
}

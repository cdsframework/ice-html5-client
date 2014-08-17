/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



function icePatient(id) {
    var settings = getSettings();
    var patientList = getPatientList();
    var patient = patientList[id];
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
    if (settings['debug']) {
        var inputNode = document.getElementById('input');
        while (inputNode.firstChild) {
            inputNode.removeChild(inputNode.firstChild);
        }
        inputNode.appendChild(document.createTextNode(inputXml));
    }
    evaluate(inputXml, patient, settings);
}

function addsubstanceAdministrationEvent(xmlString, iz) {
    if (iz[2] !== null && iz[2] !== '') {
        xmlString += '<substanceAdministrationEvent>'
                + '<templateId root="2.16.840.1.113883.3.795.11.9.1.1"/>'
                + '<id root="2.16.840.1.113883.3.795.12.100.10" extension="' + iz[0] + '"/>'
                + '<substanceAdministrationGeneralPurpose code="384810002" codeSystem="2.16.840.1.113883.6.5"/>'
                + '<substance>'
                + '<id root="' + getGuid() + '"/>'
                + '<substanceCode code="' + iz[2].split(':')[0] + '" codeSystem="2.16.840.1.113883.12.292" />'
                + '</substance>'
                + '<administrationTimeInterval low="' + iz[1] + '" high="' + iz[1] + '"/>'
                + '</substanceAdministrationEvent>';
    }
    return xmlString;
}

function evaluate(inputXml, patient, settings) {
    if (settings['debug']) {
        console.time("evaluate");
    }
    var xhr = createCORSRequest('POST', 'http://cds.hln.com:16080/opencds-decision-support-service-1.0.0-SNAPSHOT/evaluate');

    var now = new Date();

    // build SOAP request
    var sr =
            '<?xml version="1.0" encoding="utf-8"?>' +
            '<S:Envelope xmlns:S="http://www.w3.org/2003/05/soap-envelope">' +
            '<S:Body>' +
            '<ns2:evaluateAtSpecifiedTime xmlns:ns2="http://www.omg.org/spec/CDSS/201105/dss">' +
            '<interactionId scopingEntityId="gov.nyc.health" interactionId="123456"/>' +
            '<specifiedTime>' + now.toISOString().substring(0, 10) + '</specifiedTime>' +
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

    if (settings['debug']) {
        var soapRequestNode = document.getElementById('soapRequest');
        while (soapRequestNode.firstChild) {
            soapRequestNode.removeChild(soapRequestNode.firstChild);
        }
        soapRequestNode.appendChild(document.createTextNode(formatXml(sr)));
    }

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var xmlDoc = (new DOMParser()).parseFromString(xhr.responseText, 'application/xml');
                var serializer = new XMLSerializer();
                var outputXml = formatXml(serializer.serializeToString(xmlDoc));

                if (settings['debug']) {
                    var soapResponseNode = document.getElementById('soapResponse');
                    while (soapResponseNode.firstChild) {
                        soapResponseNode.removeChild(soapResponseNode.firstChild);
                    }
                    soapResponseNode.appendChild(document.createTextNode(outputXml));
                }

                processResponse(xmlDoc, patient, settings);
            }

            if (settings['debug']) {
                var requestStatusNode = document.getElementById('requestStatus');
                while (requestStatusNode.firstChild) {
                    requestStatusNode.removeChild(requestStatusNode.firstChild);
                }
                requestStatusNode.appendChild(document.createTextNode(xhr.status + ': ' + xhr.statusText));
            }
            if (settings['debug']) {
                console.timeEnd("evaluate");
            }
        }
    };

    //     Send the POST request
    xhr.setRequestHeader('Content-Type', 'text/xml');
    xhr.send(sr);
}

function processResponse(xmlDoc, patient, settings) {
    var base64EncodedPayload = xmlDoc.documentElement.getElementsByTagName('base64EncodedPayload')[0];

    // mozilla chunks large text nodes in 4k blocks...
    var response = '';
    for (var i = 0; i < base64EncodedPayload.childNodes.length; i++) {
        response += base64EncodedPayload.childNodes[i].nodeValue;
    }
    response = atob(response);

    if (settings['debug']) {
        var outputNode = document.getElementById('output');
        while (outputNode.firstChild) {
            outputNode.removeChild(outputNode.firstChild);
        }
        outputNode.appendChild(document.createTextNode(response));
    }

    var cdsOutputDoc = (new DOMParser()).parseFromString(response, 'application/xml');
    var responseJs = cdsOutput2Js(cdsOutputDoc, settings);

    renderGrid(responseJs, patient, settings);

    if (settings['debug']) {
        var responseDataNode = document.getElementById('responseData');
        while (responseDataNode.firstChild) {
            responseDataNode.removeChild(responseDataNode.firstChild);
        }
        responseDataNode.appendChild(document.createTextNode(JSON.stringify(responseJs)));
    }
}

function cdsOutput2Js(cdsOutputDoc, settings) {
    var result = {};
    var groupKey;
    for (groupKey in vaccineGroups) {
        result[groupKey] = {'groupName': vaccineGroups[groupKey],
            'evaluations': [],
            'recommendations': []
        };
    }
    result['UNKNOWN'] = {'groupName': 'UNKNOWN',
        'evaluations': [],
        'recommendations': []
    };

    var recommendations = getRecommendations(cdsOutputDoc, settings);
    for (groupKey in recommendations) {
        result[groupKey]['recommendations'] = recommendations[groupKey];
    }

    var evaluations = getEvaluations(cdsOutputDoc, settings);
    for (groupKey in evaluations) {
        result[groupKey]['evaluations'] = evaluations[groupKey];
    }
    return result;
}

function getRecommendations(cdsOutputDoc, settings) {
    var recommendations = {};
    var groupKey;
    for (groupKey in vaccineGroups) {
        recommendations[groupKey] = [];
    }
    recommendations['UNKNOWN'] = [];

    var substanceAdministrationProposalsNode = cdsOutputDoc.documentElement.getElementsByTagName('substanceAdministrationProposals')[0];
    var childNodes = substanceAdministrationProposalsNode.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeName === 'substanceAdministrationProposal') {
            var child = childNodes[i];
            var substanceCodeType = 'VACCINE_GROUP';
            var substanceCodeNode = child.getElementsByTagName('substanceCode')[0];
            if (substanceCodeNode.getAttribute('codeSystem') === cvxCodeSystem) {
                substanceCodeType = 'VACCINE';
            }
            var substanceCode = substanceCodeNode.getAttribute('code');

            var administrationTime = '';
            var proposedAdministrationTime = child.getElementsByTagName('proposedAdministrationTimeInterval');
            if (proposedAdministrationTime.length > 0) {
                administrationTime = proposedAdministrationTime[0].getAttribute('high').substring(0, 8);
            }

            // get child relatedClinicalStatements
            var relatedClinicalStatements = [];
            var childChildNodes = child.childNodes;
            for (var n = 0; n < childChildNodes.length; n++) {
                if (childChildNodes[n].nodeName === 'relatedClinicalStatement') {
                    relatedClinicalStatements[relatedClinicalStatements.length] = childChildNodes[n];
                }
            }

            if (relatedClinicalStatements !== null && typeof (relatedClinicalStatements) !== 'undefined' && relatedClinicalStatements.length > 0) {
                for (var r = 0; r < relatedClinicalStatements.length; r++) {
                    var interpretations = [];
                    var concept = null;
                    var relatedClinicalStatement = relatedClinicalStatements[r];
                    var observationResult = relatedClinicalStatement.getElementsByTagName('observationResult')[0];
                    var conceptNodes = observationResult.getElementsByTagName('concept');
                    var interpretationNodes = observationResult.getElementsByTagName('interpretation');
                    var observationFocus = observationResult.getElementsByTagName('observationFocus')[0].getAttribute('code');

                    if (conceptNodes !== null && typeof (conceptNodes) !== 'undefined' && conceptNodes.length > 0) {
                        concept = conceptNodes[0].getAttribute('code');
                    }

                    if (interpretationNodes !== null && typeof (interpretationNodes) !== 'undefined' && interpretationNodes.length > 0) {
                        for (var f = 0; f < interpretationNodes.length; f++) {
                            interpretations[f] = interpretationNodes[f].getAttribute('code');
                        }
                    }
                    var record = {
                        'substanceCode': substanceCode,
                        'substanceCodeType': substanceCodeType,
                        'administrationTime': administrationTime,
                        'concept': concept,
                        'interpretations': interpretations
                    };
                    recommendations[observationFocus][recommendations[observationFocus].length] = record;
                }
            } else {
                var observationFocus = 'UNKNOWN';
                var record = {
                    'substanceCode': substanceCode,
                    'substanceCodeType': substanceCodeType,
                    'administrationTime': administrationTime,
                    'concept': 'N/A',
                    'interpretations': []
                };
                recommendations[observationFocus][recommendations[observationFocus].length] = record;
            }
        }
    }
    return recommendations;
}

function getEvaluations(cdsOutputDoc, settings) {
    var evaluations = {};
    var groupKey;
    for (groupKey in vaccineGroups) {
        evaluations[groupKey] = [];
    }
    evaluations['UNKNOWN'] = [];

    var substanceAdministrationEventsNode = cdsOutputDoc.documentElement.getElementsByTagName('substanceAdministrationEvents')[0];
    if (typeof (substanceAdministrationEventsNode) === 'undefined') {
        return evaluations;
    }
    var childNodes = substanceAdministrationEventsNode.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeName === 'substanceAdministrationEvent') {
            var child = childNodes[i];
            var id = child.getElementsByTagName('id')[0].getAttribute('extension');
            var substanceCode = child.getElementsByTagName('substanceCode')[0].getAttribute('code');
            var administrationTime = child.getElementsByTagName('administrationTimeInterval')[0].getAttribute('high').substring(0, 8);

            // get child relatedClinicalStatements
            var relatedClinicalStatements = [];
            var childChildNodes = child.childNodes;
            for (var n = 0; n < childChildNodes.length; n++) {
                if (childChildNodes[n].nodeName === 'relatedClinicalStatement') {
                    relatedClinicalStatements[relatedClinicalStatements.length] = childChildNodes[n];
                }
            }

            if (relatedClinicalStatements !== null && typeof (relatedClinicalStatements) !== 'undefined' && relatedClinicalStatements.length > 0) {
                for (var r = 0; r < relatedClinicalStatements.length; r++) {
                    var interpretations = [];
                    var concept = null;
                    var relatedClinicalStatement = relatedClinicalStatements[r];
                    var evaluationSubstanceAdministrationEvent = relatedClinicalStatement.getElementsByTagName('substanceAdministrationEvent')[0];
                    var observationResult = evaluationSubstanceAdministrationEvent.getElementsByTagName('observationResult')[0];
                    var conceptNodes = observationResult.getElementsByTagName('concept');
                    var interpretationNodes = observationResult.getElementsByTagName('interpretation');
                    var doseNumber = evaluationSubstanceAdministrationEvent.getElementsByTagName('doseNumber')[0].getAttribute('value');
                    var isValid = evaluationSubstanceAdministrationEvent.getElementsByTagName('isValid')[0].getAttribute('value');
                    var componentSubstanceCode = evaluationSubstanceAdministrationEvent.getElementsByTagName('substanceCode')[0].getAttribute('code');
                    var observationEventTime = observationResult.getElementsByTagName('observationEventTime')[0].getAttribute('high').substring(0, 8);
                    var observationFocus = observationResult.getElementsByTagName('observationFocus')[0].getAttribute('code');

                    if (conceptNodes !== null && typeof (conceptNodes) !== 'undefined' && conceptNodes.length > 0) {
                        concept = conceptNodes[0].getAttribute('code');
                    }

                    if (interpretationNodes !== null && typeof (interpretationNodes) !== 'undefined' && interpretationNodes.length > 0) {
                        for (var f = 0; f < interpretationNodes.length; f++) {
                            interpretations[f] = interpretationNodes[f].getAttribute('code');
                        }
                    }
                    var record = {
                        'id': id,
                        'substanceCode': substanceCode,
                        'componentSubstanceCode': componentSubstanceCode,
                        'administrationTime': administrationTime,
                        'doseNumber': doseNumber,
                        'isValid': isValid,
                        'observationEventTime': observationEventTime,
                        'concept': concept,
                        'interpretations': interpretations
                    };
                    evaluations[observationFocus][evaluations[observationFocus].length] = record;
                }
            } else {
                var observationFocus = 'UNKNOWN';
                var record = {
                    'id': id,
                    'substanceCode': substanceCode,
                    'componentSubstanceCode': 'N/A',
                    'administrationTime': administrationTime,
                    'doseNumber': 'N/A',
                    'isValid': 'UNSUPPORTED',
                    'observationEventTime': 'N/A',
                    'concept': 'N/A',
                    'interpretations': []
                };
                evaluations[observationFocus][evaluations[observationFocus].length] = record;
            }
        }
    }
    return evaluations;
}

function renderGrid(responseJs, patient, settings) {

    if (settings['debug']) {
         $('#iceDebugger')[0].style.display = 'block';
    } else {
         $('#iceDebugger')[0].style.display = 'none';
    }

    var patientNameNode = $('#patientName')[0];
    while (patientNameNode.firstChild) {
        patientNameNode.removeChild(patientNameNode.firstChild);
    }
    patientNameNode.appendChild(document.createTextNode(patient['firstName'] + ' ' + patient['lastName']));

    var patientDobNode = $('#patientDob')[0];
    while (patientDobNode.firstChild) {
        patientDobNode.removeChild(patientDobNode.firstChild);
    }
    patientDobNode.appendChild(document.createTextNode(patient['dob']));

    var patientGenderNode = $('#patientGender')[0];
    while (patientGenderNode.firstChild) {
        patientGenderNode.removeChild(patientGenderNode.firstChild);
    }
    patientGenderNode.appendChild(document.createTextNode(patient['gender']));

    var tbl = $('#iceOutputGrid')[0];

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
    var evalDiv0, evalDiv1, evalP, evalA, evalDiv2, evaluation, evaluationKey;

    evalDiv0 = document.createElement('div');

    for (var i = 0; i < evaluations.length; i++) {
        evaluation = evaluations[i];

        evalDiv1 = document.createElement('div');
        if (evaluation['isValid'] === 'false') {
            evalDiv1.setAttribute('class', 'ui-shadow iceEvalSquare iceEvalFalse');
        } else {
            evalDiv1.setAttribute('class', 'ui-shadow iceEvalSquare iceEvalTrue');
        }
        evalDiv1.appendChild(document.createTextNode('Date: ' + evaluation['administrationTime']));
        evalDiv1.appendChild(document.createElement('br'));
        evalDiv1.appendChild(document.createTextNode('Age: '));
        evalDiv1.appendChild(document.createElement('br'));
        evalDiv1.appendChild(document.createTextNode('Valid: ' + evaluation['isValid']));
        evalDiv1.appendChild(document.createElement('br'));
        evalDiv1.appendChild(document.createTextNode('Vaccine: ' + cvxData[evaluation['substanceCode']]['displayName'] + ' (' + evaluation['substanceCode'] + ')'));

        evalA = document.createElement('a');
        evalA.setAttribute('href', '#eval' + i + '' + groupKey);
        evalA.setAttribute('data-rel', 'popup');
        evalA.setAttribute('data-transition', 'pop');
        evalA.setAttribute('title', 'Details');
        evalA.setAttribute('class', 'my-tooltip-btn ui-btn ui-btn-inline ui-icon-bullets ui-corner-all ui-shadow ui-btn-icon-notext icePopup');
        evalDiv1.appendChild(evalA);
        evalDiv0.appendChild(evalDiv1);

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

        evalDiv0.appendChild(evalDiv2);
    }
    return evalDiv0;
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
        } else {
            recDiv1.appendChild(document.createTextNode('Date: N/A'));
        }
        recDiv1.appendChild(document.createElement('br'));

        recDiv1.appendChild(document.createTextNode('Status: ' + recommendation['concept']));
        recDiv1.appendChild(document.createElement('br'));

        recDiv1.appendChild(document.createTextNode('Message: ' + recommendation['interpretations']));
        recDiv1.appendChild(document.createElement('br'));

        if (recommendation['substanceCodeType'] === 'VACCINE') {
            recDiv1.appendChild(document.createTextNode('Vaccine: ' + cvxData[recommendation['substanceCode']]['displayName'] + ' (' + recommendation['substanceCode'] + ')'));
        } else {
            recDiv1.appendChild(document.createTextNode('Vaccine Group: ' + vaccineGroups[recommendation['substanceCode']]));
        }

        recA = document.createElement('a');
        recA.setAttribute('href', '#rec' + groupKey);
        recA.setAttribute('data-rel', 'popup');
        recA.setAttribute('data-transition', 'pop');
        recA.setAttribute('title', 'Details');
        recA.setAttribute('class', 'my-tooltip-btn ui-btn ui-btn-inline ui-icon-bullets ui-corner-all ui-shadow ui-btn-icon-notext icePopup');
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

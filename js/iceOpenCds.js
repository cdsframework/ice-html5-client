/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



function icePatient(id) {
    var patientList = JSON.parse(localStorage.getItem('patientList'));
    var patient = patientList[id];
    var inputNode = document.getElementById('input');
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
    if (inputNode.firstChild !== null) {
        inputNode.removeChild(inputNode.firstChild);
    }
    inputNode.appendChild(document.createTextNode(inputXml));
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
                + '<substanceCode code="' + iz[2].split(':')[0] + '" codeSystem="2.16.840.1.113883.12.292" />'
                + '</substance>'
                + '<administrationTimeInterval low="' + iz[1] + '" high="' + iz[1] + '"/>'
                + '</substanceAdministrationEvent>';
    }
    return xmlString;
}

function evaluate(inputXml) {
    console.time("evaluate");
    var xhr = createCORSRequest('POST', 'http://cds.hln.com:16080/opencds-decision-support-service-1.0.0-SNAPSHOT/evaluate');
    var soapRequestNode = document.getElementById('soapRequest');

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
    if (soapRequestNode.firstChild !== null) {
        soapRequestNode.removeChild(soapRequestNode.firstChild);
    }
    soapRequestNode.appendChild(document.createTextNode(formatXml(sr)));

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var soapResponseNode = document.getElementById('soapResponse');
                var xmlDoc = (new DOMParser()).parseFromString(xhr.responseText, 'application/xml');
                var serializer = new XMLSerializer();
                var outputXml = formatXml(serializer.serializeToString(xmlDoc));

                if (soapResponseNode.firstChild !== null) {
                    soapResponseNode.removeChild(soapResponseNode.firstChild);
                }
                soapResponseNode.appendChild(document.createTextNode(outputXml));

                processResponse(xmlDoc);
            }
            var requestStatusNode = document.getElementById('requestStatus');

            if (requestStatusNode.firstChild !== null) {
                requestStatusNode.removeChild(requestStatusNode.firstChild);
            }
            requestStatusNode.appendChild(document.createTextNode(xhr.status + ': ' + xhr.statusText));

            console.timeEnd("evaluate");

        }
    };

    //     Send the POST request
    xhr.setRequestHeader('Content-Type', 'text/xml');
    xhr.send(sr);
}

function processResponse(xmlDoc) {
    var outputNode = document.getElementById('output');
    var responseDataNode = document.getElementById('responseData');
    var base64EncodedPayload = xmlDoc.getElementsByTagName('base64EncodedPayload')[0];
    if (outputNode.firstChild !== null) {
        outputNode.removeChild(outputNode.firstChild);
    }
    var response = atob(base64EncodedPayload.childNodes[0].nodeValue);
    var cdsOutputDoc = (new DOMParser()).parseFromString(response, 'application/xml');
    var responseJs = cdsOutput2Js(cdsOutputDoc);

    renderGrid(responseJs);

    if (outputNode.firstChild !== null) {
        outputNode.removeChild(outputNode.firstChild);
    }
    outputNode.appendChild(document.createTextNode(response));

    if (responseDataNode.firstChild !== null) {
        responseDataNode.removeChild(responseDataNode.firstChild);
    }
    responseDataNode.appendChild(document.createTextNode(JSON.stringify(responseJs)));
}

function cdsOutput2Js(cdsOutputDoc) {
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

    var recommendations = getRecommendations(cdsOutputDoc);
    for (groupKey in recommendations) {
        result[groupKey]['recommendations'] = recommendations[groupKey];
    }

    var evaluations = getEvaluations(cdsOutputDoc);
    for (groupKey in evaluations) {
        result[groupKey]['evaluations'] = evaluations[groupKey];
    }
    return result;
}

function getRecommendations(cdsOutputDoc) {
    var recommendations = {};
    var groupKey;
    for (groupKey in vaccineGroups) {
        recommendations[groupKey] = [];
    }
    recommendations['UNKNOWN'] = [];

    var substanceAdministrationProposalsNode = cdsOutputDoc.getElementsByTagName('substanceAdministrationProposals')[0];
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

function getEvaluations(cdsOutputDoc) {
    var evaluations = {};
    var groupKey;
    for (groupKey in vaccineGroups) {
        evaluations[groupKey] = [];
    }
    evaluations['UNKNOWN'] = [];

    var substanceAdministrationEventsNode = cdsOutputDoc.getElementsByTagName('substanceAdministrationEvents')[0];
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
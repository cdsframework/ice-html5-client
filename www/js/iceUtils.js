/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


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

function getAgeFromISOs(dateString1, dateString2) {
    return getAge(getDateFromISO(dateString1), getDateFromISO(dateString2));
}

function getDateFromISO(dateString) {
    var result = new Date(
            dateString.substring(0, 4),
            (dateString.substring(4, 6)) - 1,
            dateString.substring(6, 8),
            0, 0, 0, 0);
    return result;
}

function getAge(date1, date2) {
//    console.time('getAge');
    if ((date2.getTime() - date1.getTime()) < 0) {
        throw 'date2 is before date1!';
    }
    var years = 0;
    var months = 0;
    var days = 0;
    var tempDate1 = new Date(date1);

    // years
    // increment years until date1 is greater than date2
    while (true) {
        tempDate1.setFullYear(tempDate1.getFullYear() + 1);
        if ((date2.getTime() - tempDate1.getTime()) >= 0) {
            years++;
        } else {
            tempDate1.setFullYear(tempDate1.getFullYear() - 1);
            break;
        }
    }

    // months
    // increment months until date1 is greater than date2
    while (true) {
        tempDate1.setMonth(tempDate1.getMonth() + 1);
        if ((date2.getTime() - tempDate1.getTime()) >= 0) {
            months++;
        } else {
            tempDate1.setMonth(tempDate1.getMonth() - 1);
            break;
        }
    }

    // days
    // increment days until date1 is greater than date2
    while (true) {
        tempDate1.setDate(tempDate1.getDate() + 1);
        if ((date2.getTime() - tempDate1.getTime()) >= 0) {
            days++;
        } else {
            tempDate1.setDate(tempDate1.getDate() - 1);
            break;
        }
    }
//    console.timeEnd("getAge");
    return years + 'y ' + months + 'm ' + days + 'd';
}

function initSettings() {
    var settings = getSettings();
    $('#debugSetting').prop('checked', settings['debug']);
}
function saveSettings() {
    var settings = getSettings();
//    console.log($('input[name="debugSetting"]:checked').val());
    settings['debug'] = $('input[name="debugSetting"]:checked').val() === 'on';
    setSettings(settings);
    document.location.href = '#main';
    location.reload();

}

function sleep(millis, callback) {
    setTimeout(function()
    {
        callback();
    }
    , millis);
}
/**
 * Retrieve the settings from the local storage mechanism
 * 
 * @returns {Array|Object}
 */
function getSettings() {
    var rawSettings = localStorage.getItem('settings');
    if (rawSettings === '{}' || rawSettings === null || rawSettings === '') {
        localStorage.setItem('settings', JSON.stringify({'debug': false}));
        rawSettings = localStorage.getItem('settings');
    }
//    console.log(JSON.parse(rawSettings));
    return JSON.parse(rawSettings);
}

/**
 * Sets the settings in the local storage mechanism
 * 
 * @param {type} settings
 * @returns {undefined}
 */
function setSettings(settings) {
//    console.log(settings);
    localStorage.setItem('settings', JSON.stringify(settings));
}
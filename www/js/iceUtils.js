var currentPage = 'main';

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

var getGuid = (function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
    }
    return function () {
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
    jQuery.each(xml.split('\r\n'), function (index, node) {
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

function getFormattedDateFromISO(dateString) {
    var rawDate = getDateFromISO(dateString);
    var day = rawDate.getDate();
    if (day < 10) {
        day = '0' + day;
    }
    var month = (rawDate.getMonth() + 1);
    if (month < 10) {
        month = '0' + month;
    }
    var result = rawDate.getFullYear() + '-' + month + '-' + day;
    return result;
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
    currentPage = 'main';
    document.location.href = '#main';
    location.reload();

}

function sleep(millis, callback) {
    setTimeout(function ()
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

/**
 * Set the viewed intro setting to true.
 * 
 * @returns {undefined}
 */
function setViewedIntro() {
    var settings = getSettings();
    settings['viewedIntro'] = true;
    setSettings(settings);
}


function isMobile() {
    var check = false;
    var a = (window.navigator.userAgent || navigator.vendor || window.opera);
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iPad|iPhone|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)
            ||
            /(iPad)/i.test(a)
            ||
            /(iPhone)/i.test(a)
            ||
            /(iPod)/i.test(a)
            ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
            ) {
        check = true;
    }
    return check;
}

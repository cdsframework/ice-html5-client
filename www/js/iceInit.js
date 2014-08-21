/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$.datepicker._defaults.dateFormat = 'yymmdd';
$.datepicker._defaults.changeYear = true;
$.datepicker._defaults.changeMonth = true;
//console.log($.datepicker._defaults);

function onLoad() {
    document.addEventListener('deviceready', deviceReady, false);
    if (getSettings()['viewedIntro'] !== true) {
        document.location = '#about';
    }
}

function deviceReady() {
    document.addEventListener('backbutton', backButtonCallback, false);
}

function backButtonCallback() {
    document.location = '#exitConfirm';
}

// console.log('done');

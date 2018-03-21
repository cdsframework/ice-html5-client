/* 
 * ICE Client initialization script.
 */

var version = '1.0.11';

function onLoad() {

    $.validator.setDefaults({
        debug: true,
        success: "valid"
    });

    if (mobileDetected) {
        $('#importPatientButton').hide();
    }

    initPatientValidation();

    document.addEventListener('deviceready', deviceReady, false);
    if (getSettings()['viewedIntro'] !== true) {
        document.location = '#about';
    }
}

function deviceReady() {
    document.addEventListener('backbutton', backButtonCallback, false);
}

function backButtonCallback() {
    if (currentPage === 'main') {
        document.location = '#exitConfirm';
    } else {
        currentPage = 'main';
        window.history.back();
    }
}

var mobileDetected = isMobile();
// console.log('done');

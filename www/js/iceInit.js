/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var version = '1.0.7';

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
    if (currentPage === 'main') {
        document.location = '#exitConfirm';
    } else {
        currentPage = 'main';
        window.history.back();
    }
}

// console.log('done');

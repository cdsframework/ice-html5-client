/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var files;

$.datepicker._defaults.dateFormat = 'yymmdd';
$.datepicker._defaults.changeYear = true;
$.datepicker._defaults.changeMonth = true;
//console.log($.datepicker._defaults);

$(function() {

    $('.cvxAutoComplete').autocomplete({
        source: getCvxData()
    });
});

// console.log('done');

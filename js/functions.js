

// VARIABLES GLOBALS 
var lang = '';
var idInc;



//###################################################################################
//##################      TRADUCCIONS PER ELS LITERALS DEL JS    ####################
//###################################################################################
var msg_langs = new Array();
// es
msg_langs['recogida_es'] = 'Recogida';
//###################################################################################
//###################################################################################



//###################################################################################
//##################  per carregar pagines externes amb jquery ####################
//###################################################################################

$(document).bind("mobileinit", function () {
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
});
// Determine support properties
(function (xhr) {
    jQuery.extend(jQuery.support, {
        ajax: !!xhr,
        cors: !!xhr && ("withCredentials" in xhr)
    });
})(jQuery.ajaxSettings.xhr());

//###################################################################################
//###################################################################################




//###################################################################################
//##################           CONTROL DEL BACKGROUND            ####################
//###################################################################################

$(window).resize(function () {
    $('.ui-mobile-viewport').css('background-size', $('.ui-mobile-viewport').width() + 'px auto');
});

//###################################################################################
//###################################################################################




//###################################################################################
//##################              CÀRREGA DEL DOM                ####################
//##################################################################################

$(document).ready(function () {


    //###################################################################################
    ///////////////   IDIOMA DEL DISPOSITIU    ////////////////////////
    //###################################################################################
    lang = navigator.language.split("-");
    lang = lang[0].split(",");
    lang = (lang[0]);

    if (lang != 'es' && lang != 'en' && lang != 'de')
        lang = 'en';
    /*$.getJSON("langs/" + lang + '.json', function (lang_s) {
     $.each(lang_s, function (indice, nombre) {
     $('.' + indice).text(nombre);
     });
     });
     $.getJSON("langs/placeholder_" + lang + '.json', function (lang_s) {
     ;
     
     $.each(lang_s, function (indice, nombre) {
     $('.' + indice).attr('placeholder', nombre);
     });
     });*/

    //###################################################################################
    //###################################################################################



    //###################################################################################
    //////////////// TORNADA ENRERA ///////////////////////////
    //###################################################################################

    $(".pagina").on("swiperight", function () {
        window.history.back();
        //navigator.app.backHistory();
        /*if($.mobile.activePage.attr("id") != "incidenciaPasa4"){
         history.back(); 
         }else window.location = 'main.html';*/
    });

    //###################################################################################
    //###################################################################################


    //###################################################################################
    ////////////////    jquery plugins   ///////////////////////////
    //###################################################################################

    $('#activaNotificacions').rcSwitcher({
        width: 50,
        height: 20,
        blobOffset: 2,
        onText: '',
        offText: '',
        theme: 'light',
        autoStick: true,
    });
    $('#incidenciaResolta').rcSwitcher({
        width: 50,
        height: 20,
        blobOffset: 2,
        onText: '',
        offText: '',
        theme: 'light',
        autoStick: true,
    });

    ////////////////    TEXTAREA ISSUE   ///////////////////////////
    $('textarea').keypress(function () {
        var texta = $(this);
        texta.scrollTop(texta[0].scrollHeight);
    });


    /////////// MOSTRA INPUTS E-MAIL I TELEFON /////////////////
    $('#rebreNotificacio').change(function () {
        if ($(this).is(':checked')) {
            $('#rebreNotificacioInfo').show();
        } else {
            $('#rebreNotificacioInfo').hide();
            $('#email_usuari').val('');
            $('#tel_usuari').val('');
        }
    });

    ////////// CARREGAM DADES EXISTENTS ////////////
    $('#nom_usuari').val(localStorage.getItem("nom_usuari"));
    $('#llinatges_usuari').val(localStorage.getItem("llinatges_usuari"));
    $('#email_usuari').val(localStorage.getItem("email_usuari"));
    $('#tel_usuari').val(localStorage.getItem("tel_usuari"));



});

//###################################################################################
//###################################################################################





//###################################################################################
//##################                FUNCIONS                    ####################
//##################################################################################

function carrega(url) {
    var ref = window.open(url, '_system', 'location=yes');
}


function areYouSure(text2, button, callback, back_) {
    $("#sure .sure-2").text(text2);
    $("#sure .sure-do").text(button).on("click.sure", function () {
        $(this).off("click.sure");
        callback();
    });
    $.mobile.changePage("#sure");
}

function openDeviceBrowser(externalLinkToOpen) {
    window.open(externalLinkToOpen, '_system', 'location=no');
}
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function error_(codi, json, error) {
    $.post('http://bitgrup.es/webtest/clickincidencies/App/incidencies.php', {funcio: 'appError', TOKEN: 'LAIDSD88347ERJKADKFGKAHPF8YA9DF8Y', codi: codi, json: json, error: error}, function (data) {});
}

//#############################################################
//############   PASSES NOVA INCIDENCIA    ####################
//#############################################################

function comprovaPasa1() {

    var ok = true;

    /*if ($('#imgIncidencia').attr('src') == '' || $('#imgIncidencia').attr('src') == 'images/no-img-2.jpg'){
     ok = false;
     $('.getImg').addClass('obligatori');
     }else $('.getImg').removeClass('obligatori');
     */

    //imatges
    if (ok) {
        if (window.numImatges == 0)
            $('#imgIncidencia2').attr('src', 'images/no-img-incid.png');
        if (window.numImatges > 0)
            $('#imgIncidencia2').attr('src', $('#imgIncidencia').attr('src'));
        else {
            $('#imgIncidencia2').attr('src', 'images/no-img-incid.png')
        }
        if (window.numImatges > 1)
            $('#imgIncidencia3').attr('src', $('#imgIncidenciaB').attr('src'));
        else {
            $('#imgIncidencia3').attr('src', 'images/no-img-incid.png')
        }
        if (window.numImatges > 2)
            $('#imgIncidencia4').attr('src', $('#imgIncidenciaC').attr('src'));
        else {
            $('#imgIncidencia4').attr('src', 'images/no-img-incid.png')
        }
    }

    var tipusInc = $('#tipusIncidencia').val();
    var strInc = $('#tipus-incidencia-' + tipusInc).attr('title');
    $('#tipusIncidenciaP').text(strInc);
    return ok;
}

function comprovaPasa1b() {

    var ok = true;
    /*
     if ($('#titolIncidencia').val() == ''){
     $('#titolIncidencia').addClass('obligatori');
     ok = false;
     }else $('#titolIncidencia').removeClass('obligatori');
     */
    if ($('#descIncidencia').val() == '') {
        $('#descIncidencia').addClass('obligatori');
        ok = false;
    } else
        $('#descIncidencia').removeClass('obligatori');


    return ok;
}

function comprovaPasa2() {
    var ok = true;
    if ($('#latitutIncidencia').val() === '' || $('#longitutIncidencia').val() === '') {
        alert('Indicau una localització correcte al mapa');
        ok = false;
    }

    return ok;
}

function comprovaPasa2B() {

    var ok = true;

    if ($('#nom_usuari').val() == '') {
        $('#nom_usuari').addClass('obligatori');
        ok = false;
    } else {
        $('#nom_usuari').removeClass('obligatori');
        localStorage.setItem("nom_usuari", $('#nom_usuari').val());
    }

    if ($('#llinatges_usuari').val() == '') {
        $('#llinatges_usuari').addClass('obligatori');
        ok = false;
    } else {
        $('#llinatges_usuari').removeClass('obligatori');
        localStorage.setItem("llinatges_usuari", $('#llinatges_usuari').val());
    }

    if ($('#email_usuari').val() == '' && $('#rebreNotificacio').is(':checked') && $('#tel_usuari').val() == '') {
        $('#email_usuari').addClass('obligatori');
        ok = false;
    } else {
        $('#email_usuari').removeClass('obligatori');
        $('#tel_usuari').removeClass('obligatori');
        localStorage.setItem("email_usuari", $('#email_usuari').val());
        localStorage.setItem("tel_usuari", $('#tel_usuari').val());
    }


    return ok;
}

//############  RESUM INCIDENIA #########
$(document).on("pagebeforeshow", "#veureIncidencia", function () { // When entering pagetwo
    mostraIncidencia();
});
$(document).on("pagebeforeshow", "#veureIncidenciaOperari", function () { // When entering pagetwo
    mostraIncidenciaOperari();
});
$(document).on("pagebeforeshow", "#incidenciaPasa3", function () { // When entering pagetwo

    try {
        $('#titolIncidenciaP').text($('#titolIncidencia').val());
        $('#adresaIncidenciaP').text($('#adresaIncidencia').val() + ', ' + $('#poblacioIncidencia').val());
        $('#dataIncidenciaP').text(getFecha());
        $('#comentariIncidenciaP').text($('#descIncidencia').val());
    } catch (e) {
        error_('E FUNCTIONS-297', '', e);
    }

});

//############ ELIMINAM FORM SI PANTALLA TIPUS INCIDENCIA #########
$(document).on("pagebeforeshow", "#afegirIncidencia", function () {

    //BUIDAM
    $('input[type!="hidden"], textarea').each(function (index, e) {
        $(this).val('');
    });

    ////////// CARREGAM DADES EXISTENTS ////////////
    $('#nom_usuari').val(localStorage.getItem("nom_usuari"));
    $('#llinatges_usuari').val(localStorage.getItem("llinatges_usuari"));
    $('#email_usuari').val(localStorage.getItem("email_usuari"));
    $('#tel_usuari').val(localStorage.getItem("tel_usuari"));
    $('#incidenciaNoVisible').prop( "checked", false );

    //imatges
    removeImg(3);
    removeImg(2);
    removeImg(1);
    window.numImatges = 0;

});

function getFecha() {
    var fecha = new Date();
    var dia = fecha.getDate();
    if (dia < 10)
        dia = '0' + dia;
    var mes = fecha.getMonth() + 1;
    if (mes < 10)
        mes = '0' + mes;
    return dia + '/' + mes + '/' + fecha.getFullYear() + ' ' + fecha.getHours() + ':' + fecha.getMinutes()
}
$(document).on("pagebeforeshow", "#darreresIncidencies", function () { // When entering pagetwo 
    try {
        //window.mapa.clear();
        carregaMapa(xml_incidencies);
    } catch (e) {
        error_('E FUNCTIONS-339', '', e);
    }
});

//#############################################################
//#############################################################
//#############################################################




//#############################################################
//##################  ENVIAMENT DE LA INCIDENIA ###############
//#############################################################
function enviaIncidencia() {
    var incidenciaNoVisible = 0;
    if ($('#incidenciaNoVisible').is(':checked')){
        incidenciaNoVisible = 1;
    }
    var parametros = {
        adresa: document.getElementById("adresaIncidencia").value,
        //titol: document.getElementById("titolIncidencia").value,
        titol: '',
        macAddress: window.MACadress,
        idU: readCookie('idU'),
        idP: readCookie('idP'),
        nucli: document.getElementById("poblacioIncidencia").value,
        tipus: document.getElementById("tipusIncidencia").value,
        desc: document.getElementById("descIncidencia").value,
        longitut: document.getElementById("longitutIncidencia").value,
        latitut: document.getElementById("latitutIncidencia").value,
        nom_usuari: document.getElementById("nom_usuari").value,
        llinatges_usuari: document.getElementById("llinatges_usuari").value,
        email_usuari: document.getElementById("email_usuari").value,
        tel_usuari: document.getElementById("tel_usuari").value,
        ip_usuari: window.myip,
        incidenciaNoVisible: incidenciaNoVisible,
        name: 'imgIncidencia',
        funcio: 'novaIncidencia',
        TOKEN: 'LAIDSD88347ERJKADKFGKAHPF8YA9DF8Y'
    }


    if (window.numImatges == 0) {
        $.ajax({
            url: 'http://bitgrup.es/webtest/clickincidencies/App/incidencies.php', type: 'POST', data: parametros,
            cache: false,  async: false,  beforeSend: function () {},
            success: function (data) {
                try {
                    var resposta = JSON.parse(data);
                    if (resposta.error == '1') {
                        error_('E FUNCTIONS-399', 'ERROR ENVIANT INCIDENCIA', resposta.str);
                        alert('E FUNCTIONS-399:  ERROR ENVIANT INCIDENCIA');
                    } else {
                        $('#loading').css('display', 'none');
                        $.mobile.changePage("#incidenciaPasa4", {transition: "slide", changeHash: false});
                    }
                } catch (e) {
                    error_('E FUNCTIONS-407', 'ERROR ENVIANT INCIDENCIA', e);
                    alert('E FUNCTIONS-407:  ERROR ENVIANT INCIDENCIA');
                }
            },
            error: function (e) {
                error_('E FUNCTIONS-412', 'ERROR ENVIANT INCIDENCIA', e);
                alert('E FUNCTIONS-412:  ERROR ENVIANT INCIDENCIA');
            }
        });
    } else {
        //IMG 1 AMB ELS INPUTS
        var imageURI = document.getElementById('imgIncidencia').getAttribute("src");
        var options = new FileUploadOptions();
        options.fileKey = "imgIncidencia";
        options.fileName = 'imgIncidencia';
        options.mimeType = "image/jpeg";
        options.chunkedMode = false;
        //var rebreNotificacio = ($('#rebreNotificacio').is(':checked')) ? 1 : 0;
        options.params = parametros;
        var ft = new FileTransfer();
        ft.onprogress = function (progressEvent) {
            $('#loading').css('display', 'table');
        };
        ft.upload(imageURI, encodeURI("http://bitgrup.es/webtest/clickincidencies/App/incidencies.php"), win, fail, options);
    }

    return false;
}
function onFail(message) {
    $('#loading').css('display', 'none');
    error_('E FUNCTIONS-395', 'ERROR ENVIANT INCIDENCIA', message);
    alert('E FUNCTIONS-395:  ERROR ENVIANT INCIDENCIA');
}

function win(data) {
    try {
        console.log(data);
        var resposta = JSON.parse(data.response);
        if (resposta.error == '1') {
            $('#loading').css('display', 'none');
            alert('E FUNCTIONS-405: ERROR ENVIANT INCIDENCIA');
            error_('E FUNCTIONS-405', data.response, resposta.str);
        } else {
            if (window.numImatges > 1)
                enviaSegonaImatge(resposta.id);
            if (window.numImatges == 1) {
                $('#loading').css('display', 'none');
                $.mobile.changePage("#incidenciaPasa4", {transition: "slide", changeHash: false});
            }
        }
    } catch (e) {
        $('#loading').css('display', 'none');
        error_('E FUNCTIONS-416', data, e);
        alert('E FUNCTIONS-416: ERROR ENVIANT INCIDENCIA');
    }
}

function fail(error) {
    $('#loading').css('display', 'none');
    error_('E FUNCTIONS-424', 'ERROR ENVIANT INCIDENCIA', "An error has occurred: Code = " + error.code + ', ' + error.target + ', ' + error.http_status + ', ' + error.exception);
    alert('E FUNCTIONS-424: ERROR ENVIANT INCIDENCIA');
}

function enviaSegonaImatge(id) {
    //IMG 2
    var imageURI = document.getElementById('imgIncidenciaB').getAttribute("src");
    var options = new FileUploadOptions();
    options.fileKey = "imgIncidencia";
    options.fileName = 'imgIncidencia';
    options.mimeType = "image/jpeg";
    options.chunkedMode = false;

    options.params = {
        name: 'imgIncidencia',
        funcio: 'segonaImatge',
        TOKEN: 'LAIDSD88347ERJKADKFGKAHPF8YA9DF8Y',
        id: id
    }
    var ft = new FileTransfer();
    ft.onprogress = function (progressEvent) {
        $('#loading').css('display', 'table');
    };
    ft.upload(imageURI, encodeURI("http://bitgrup.es/webtest/clickincidencies/App/incidencies.php"), win2, fail2, options);
}

function win2(data) {
    try {
        var resposta = JSON.parse(data.response);
        retorna = resposta;
        if (resposta.error == '1') {
            error_('E FUNCTIONS-455', data.response, resposta.str);
            $('#loading').css('display', 'none');
        } else {
            if (window.numImatges > 2) {
                enviaTerceraImatge(resposta.id);
            }
            if (window.numImatges == 2) {
                $('#loading').css('display', 'none');
                $.mobile.changePage("#incidenciaPasa4", {transition: "slide", changeHash: false});
            }
        }
    } catch (e) {
        $('#loading').css('display', 'none');
        error_('E FUNCTIONS-459', data.response, e);
        $.mobile.changePage("#incidenciaPasa4", {transition: "slide", changeHash: false});
    }
}
function fail2(error) {
    $('#loading').css('display', 'none');
    error_('E FUNCTIONS-475', '', error);
    $.mobile.changePage("#incidenciaPasa4", {transition: "slide", changeHash: false});
}

function enviaTerceraImatge(id) {
    //IMG 3
    var imageURI = document.getElementById('imgIncidenciaC').getAttribute("src");
    var options = new FileUploadOptions();
    options.fileKey = "imgIncidencia";
    options.fileName = 'imgIncidencia';
    options.mimeType = "image/jpeg";
    options.chunkedMode = false;

    options.params = {
        name: 'imgIncidencia',
        funcio: 'terceraImatge',
        TOKEN: 'LAIDSD88347ERJKADKFGKAHPF8YA9DF8Y',
        id: id
    }
    var ft = new FileTransfer();
    ft.onprogress = function (progressEvent) {
        $('#loading').css('display', 'table');
    };
    ft.upload(imageURI, encodeURI("http://bitgrup.es/webtest/clickincidencies/App/incidencies.php"), win3, fail2, options);
}

function win3(data) {
    $('#loading').css('display', 'none');
    $.mobile.changePage("#incidenciaPasa4", {transition: "slide", changeHash: false});
}

function refrescarTot() {
    window.mapa.clear();
    document.location = 'main.html';
}



//#############################################################
//#############################################################
//#############################################################



//#############################################################
//#########################  MAPA ############################
//#############################################################
$(document).on("pagebeforeshow", "#darreresIncidencies", function (event, data) { // When entering pagetwo 
    var anterior = String(data.prevPage.attr('id'));
    if (anterior != 'veureIncidencia') {
        try {
            carregaMapa();
        } catch (e) {
            error_('E FUNCTIONS-529', '', e);
        }
    }
});

$(document).on("pagebeforeshow", "#incidenciaPasa2", function (event, data) { // When entering pagetwo darreresIncidencies
    var anterior = String(data.prevPage.attr('id'));
    if (anterior != 'incidenciaPasa3') {
        try {
            //window.mapa.clear();
            carregaMapaPosicionament();
        } catch (e) {
            error_('E FUNCTIONS-540', 'carregaMapaPosicionament', e);
        }
    }
});

function comprovaPosicio(lat, long) {
    return true;
    var ok = true;
    //limits regions artà
    if (lat > 39.769914  || lat < 39.630348 || long < 3.379006 || long > 3.473944)
        ok = false;
    return ok;
}
function errorMapa() {
    alert('No es pot aconseguir la vostra localització, indicau una localització al mapa');
    try {
        window.mapa.animateCamera({
            target: {
                lat: 39.694881,
                lng: 3.3551102,
            },
            'duration': 2,
            zoom: 15
        });
    } catch (e) {
        error_('E FUNCTIONS-564', 'animateCamara', e);
    }
}
//#############################################################
//#############################################################



//#############################################################
//############		LLISTAT INCIDENCIES   #####################
//#############################################################
function carregaLista(tipus) {
    if (tipus == 1) {
        $('.lista2').css('display', 'none');
        $('.lista1').css('display', 'block');
        $('#darreresIncidencies .list').addClass('actiu');
        $('#darreresIncidencies .location').removeClass('actiu');
    } else {
        $('.lista1').css('display', 'none');
        $('.lista2').css('display', 'block');
        $('#darreresIncidencies .location').addClass('actiu');
        $('#darreresIncidencies .list').removeClass('actiu');
    }
}
//#############################################################
//#############################################################
//#############################################################
